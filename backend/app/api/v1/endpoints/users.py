"""
User Profile API endpoints.
Provides profile retrieval, profile updates, and personal stats dashboard metrics.
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status

from app.services.user_service import UserService
from app.core.dependencies import get_current_user

router = APIRouter()


@router.get(
    "/me",
    summary="Get profile of authenticated user",
    tags=["Users & Profiles"],
)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Retrieve full profile details for the authenticated user."""
    user_id = current_user.get("user_id", "demo_user")
    profile = UserService.get_profile(user_id)
    if not profile:
        profile = {
            "id": user_id,
            "supabase_uid": user_id,
            "email": current_user.get("email", "demo@civilink.ai"),
            "display_name": current_user.get("name", "Community Member"),
            "photo_url": current_user.get("picture"),
            "phone": "+1 (555) 234-5678",
            "bio": "Active civic reporter and neighborhood resident.",
            "neighborhood": "Greenwood Heights",
            "is_admin": False,
            "is_active": True,
            "reputation_score": 94,
            "total_reports": 12,
            "total_posts": 24,
            "communities_joined": 3,
            "created_at": "2025-01-15T00:00:00Z",
        }
    return profile


@router.put(
    "/me",
    summary="Update authenticated user profile",
    tags=["Users & Profiles"],
)
async def update_my_profile(
    payload: dict,
    current_user: dict = Depends(get_current_user),
):
    """Update profile fields (display_name, bio, phone, neighborhood)."""
    user_id = current_user.get("user_id", "demo_user")
    updated = UserService.update_profile(user_id, payload)
    return updated


@router.get(
    "/{user_id}",
    summary="Get public profile of user",
    tags=["Users & Profiles"],
)
async def get_user_profile(user_id: str):
    """Retrieve public profile for any community user by ID."""
    profile = UserService.get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")
    return profile
