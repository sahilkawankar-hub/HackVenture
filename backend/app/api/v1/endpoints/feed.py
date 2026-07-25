"""
Community Feed endpoints.

CRUD operations for community posts, comments, and reactions.
"""

import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from app.core.dependencies import get_current_user
from app.utils.firebase import get_document, set_document, query_collection, delete_document
from app.models import Collections

router = APIRouter()


# ── Schemas ───────────────────────────────────────────────────────────────────

class PostCreate(BaseModel):
    community_id: str = "community_default"
    title: str
    content: str
    category: str = "Discussion"
    image_url: Optional[str] = None


class CommentCreate(BaseModel):
    text: str


class PostResponse(BaseModel):
    id: str
    author_id: str
    author_name: Optional[str] = None
    community_id: str
    title: str
    content: str
    category: str
    image_url: Optional[str] = None
    likes: int = 0
    comment_count: int = 0
    is_pinned: bool = False
    created_at: str
    updated_at: Optional[str] = None

    model_config = {"from_attributes": True}


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.get("/", response_model=List[PostResponse], summary="List feed posts")
async def list_posts(
    community_id: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
):
    """List community feed posts, newest first."""
    filters = [("is_deleted", "==", False)]
    if community_id:
        filters.append(("community_id", "==", community_id))
    if category and category != "All":
        filters.append(("category", "==", category))

    posts = query_collection(Collections.POSTS, filters=filters, order_by="created_at", limit=limit)
    return [PostResponse(**p) for p in posts]


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED, summary="Create a post")
async def create_post(payload: PostCreate, current_user: dict = Depends(get_current_user)):
    """Create a new community feed post."""
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "author_id": current_user["user_id"],
        "author_name": current_user.get("name") or current_user.get("email", ""),
        "community_id": payload.community_id,
        "title": payload.title,
        "content": payload.content,
        "category": payload.category,
        "image_url": payload.image_url,
        "likes": 0,
        "liked_by": [],
        "comment_count": 0,
        "is_pinned": False,
        "is_deleted": False,
        "created_at": now,
        "updated_at": now,
    }
    set_document(Collections.POSTS, doc["id"], doc)
    return PostResponse(**doc)


@router.get("/{post_id}", response_model=PostResponse, summary="Get a post")
async def get_post(post_id: str):
    """Get a single community feed post."""
    post = get_document(Collections.POSTS, post_id)
    if not post or post.get("is_deleted"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return PostResponse(**post)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a post")
async def delete_post(post_id: str, current_user: dict = Depends(get_current_user)):
    """Soft-delete a post (author or admin only)."""
    post = get_document(Collections.POSTS, post_id)
    if not post or post.get("is_deleted"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post["author_id"] != current_user["user_id"] and not current_user.get("is_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    post["is_deleted"] = True
    post["updated_at"] = datetime.now(timezone.utc).isoformat()
    set_document(Collections.POSTS, post_id, post)


@router.post("/{post_id}/like", response_model=PostResponse, summary="Like/unlike a post")
async def toggle_like(post_id: str, current_user: dict = Depends(get_current_user)):
    """Toggle like on a post."""
    post = get_document(Collections.POSTS, post_id)
    if not post or post.get("is_deleted"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    uid = current_user["user_id"]
    liked_by: list = post.get("liked_by", [])
    if uid in liked_by:
        liked_by.remove(uid)
    else:
        liked_by.append(uid)
    post["liked_by"] = liked_by
    post["likes"] = len(liked_by)
    post["updated_at"] = datetime.now(timezone.utc).isoformat()
    set_document(Collections.POSTS, post_id, post)
    return PostResponse(**post)


@router.post("/{post_id}/comment", summary="Add a comment")
async def add_comment(
    post_id: str,
    payload: CommentCreate,
    current_user: dict = Depends(get_current_user),
):
    """Add a comment to a post."""
    post = get_document(Collections.POSTS, post_id)
    if not post or post.get("is_deleted"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    now = datetime.now(timezone.utc).isoformat()
    comment = {
        "id": str(uuid.uuid4()),
        "post_id": post_id,
        "author_id": current_user["user_id"],
        "author_name": current_user.get("name") or current_user.get("email", ""),
        "text": payload.text,
        "created_at": now,
    }
    comment_collection_id = f"comments_{post_id}"
    set_document(comment_collection_id, comment["id"], comment)
    post["comment_count"] = post.get("comment_count", 0) + 1
    post["updated_at"] = now
    set_document(Collections.POSTS, post_id, post)
    return comment
