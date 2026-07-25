"""
Community Management API endpoints.
Provides community creation, joining, membership roles, and join request approval workflows.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException, Query, status

from app.services.community_service import CommunityService
from app.core.dependencies import get_current_user

router = APIRouter()


@router.get(
    "/communities",
    summary="List communities",
    tags=["Community Management"],
)
async def list_communities(
    search: Optional[str] = Query(None),
    community_type: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
):
    """List public and neighborhood communities."""
    communities = CommunityService.get_communities(search=search, community_type=community_type, limit=limit)
    return communities


@router.get(
    "/communities/{community_id}",
    summary="Get community details",
    tags=["Community Management"],
)
async def get_community(community_id: str):
    """Get full details for a community."""
    comm = CommunityService.get_community(community_id)
    if not comm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    return comm


@router.post(
    "/communities",
    summary="Create a new community",
    tags=["Community Management"],
)
async def create_community(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    community_type: str = Form("neighborhood"),
    join_policy: str = Form("public"),
    address: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    rules: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    max_members: Optional[int] = Form(500),
    cover_image: Optional[UploadFile] = File(None),
    logo_image: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user),
):
    """Create a new community and automatically assign creator as Owner."""
    user_id = current_user.get("user_id", "demo_user")
    cover_url: Optional[str] = None
    logo_url: Optional[str] = None

    if cover_image:
        contents = await cover_image.read()
        cover_url = CommunityService.upload_image(contents, folder="community_covers")
    if logo_image:
        contents = await logo_image.read()
        logo_url = CommunityService.upload_image(contents, folder="community_logos")

    tags_list = [t.strip() for t in tags.split(",") if t.strip()] if tags else []

    doc = CommunityService.create_community(
        creator_id=user_id,
        name=name,
        description=description,
        community_type=community_type,
        join_policy=join_policy,
        address=address,
        latitude=latitude,
        longitude=longitude,
        rules=rules,
        tags=tags_list,
        max_members=max_members,
        cover_image_url=cover_url,
        logo_url=logo_url,
    )
    return doc


@router.post(
    "/communities/{community_id}/join",
    summary="Join or request to join a community",
    tags=["Community Management"],
)
async def join_community(
    community_id: str,
    payload: dict,
    current_user: dict = Depends(get_current_user),
):
    """Join a public community or submit a join request for approval-required communities."""
    user_id = current_user.get("user_id", "demo_user")
    result = CommunityService.join_community(
        community_id=community_id,
        user_id=user_id,
        message=payload.get("message"),
    )
    return result


@router.delete(
    "/communities/{community_id}/leave",
    summary="Leave a community",
    tags=["Community Management"],
)
async def leave_community(
    community_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Leave a community."""
    user_id = current_user.get("user_id", "demo_user")
    CommunityService.leave_community(community_id, user_id)
    return {"message": "Successfully left community"}


@router.get(
    "/communities/{community_id}/members",
    summary="List community members",
    tags=["Community Management"],
)
async def get_community_members(community_id: str):
    """List members of a community with their assigned roles."""
    members = CommunityService.get_members(community_id)
    return members


@router.get(
    "/communities/{community_id}/join-requests",
    summary="List pending join requests for community",
    tags=["Community Management"],
)
async def get_join_requests(
    community_id: str,
    current_user: dict = Depends(get_current_user),
):
    """List pending membership requests for community admins/moderators."""
    requests = CommunityService.get_join_requests(community_id)
    return requests


@router.post(
    "/communities/{community_id}/join-requests/{request_id}/approve",
    summary="Approve join request",
    tags=["Community Management"],
)
async def approve_request(
    community_id: str,
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Approve a pending join request."""
    result = CommunityService.approve_join_request(community_id, request_id)
    return result


@router.post(
    "/communities/{community_id}/join-requests/{request_id}/reject",
    summary="Reject join request",
    tags=["Community Management"],
)
async def reject_request(
    community_id: str,
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Reject a pending join request."""
    result = CommunityService.reject_join_request(community_id, request_id)
    return result


@router.get(
    "/my-communities",
    summary="Get communities joined by current user",
    tags=["Community Management"],
)
async def get_my_communities(current_user: dict = Depends(get_current_user)):
    """List communities that the current user belongs to."""
    user_id = current_user.get("user_id", "demo_user")
    communities = CommunityService.get_user_communities(user_id)
    return communities
