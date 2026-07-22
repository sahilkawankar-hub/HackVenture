"""
Community Feed service.

Business logic for posts, comments, and reactions backed by Firestore.
"""

from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone
from app.utils.firebase import (
    get_document,
    set_document,
    query_collection,
    delete_document,
)
from app.models import Collections
from app.models.post import create_post_doc, create_comment_doc


class FeedService:
    @staticmethod
    def get_posts(community_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """List active feed posts for a community."""
        return query_collection(
            Collections.POSTS,
            filters=[
                ("community_id", "==", community_id),
                ("is_deleted", "==", False),
            ],
            order_by="created_at",
            limit=limit,
        )

    @staticmethod
    def create_post(
        author_id: str,
        community_id: str,
        content: str,
        media_urls: Optional[List[str]] = None,
        category: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Create a new feed post."""
        post_data = create_post_doc(
            author_id=author_id,
            community_id=community_id,
            content=content,
            media_urls=media_urls,
            category=category,
        )
        set_document(Collections.POSTS, post_data["id"], post_data)
        return post_data

    @staticmethod
    def get_post(post_id: str) -> Optional[Dict[str, Any]]:
        """Get post by ID."""
        post = get_document(Collections.POSTS, post_id)
        if post and not post.get("is_deleted", False):
            return post
        return None

    @staticmethod
    def add_comment(post_id: str, author_id: str, content: str) -> Optional[Dict[str, Any]]:
        """Add a comment to a post."""
        post = FeedService.get_post(post_id)
        if not post:
            return None

        comment_data = create_comment_doc(post_id=post_id, author_id=author_id, content=content)
        comments = post.get("comments", [])
        comments.append(comment_data)

        post["comments"] = comments
        post["comment_count"] = len(comments)
        post["updated_at"] = datetime.now(timezone.utc).isoformat()

        set_document(Collections.POSTS, post_id, post)
        return comment_data

    @staticmethod
    def react_to_post(post_id: str, user_id: str, reaction_type: str = "like") -> Optional[Dict[str, Any]]:
        """Add or toggle a reaction on a post."""
        post = FeedService.get_post(post_id)
        if not post:
            return None

        reactions = post.get("reactions", {})
        reactions[user_id] = reaction_type
        post["reactions"] = reactions
        post["like_count"] = len(reactions)

        set_document(Collections.POSTS, post_id, post)
        return {"post_id": post_id, "user_id": user_id, "reaction_type": reaction_type}
