"""
Admin Dashboard endpoints.
Provides system governance statistics, complaint routing, user moderation, and resolution analytics.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.services.admin_service import AdminService
from app.core.dependencies import get_current_admin_user

router = APIRouter()


@router.get(
    "/stats",
    summary="Get system-wide KPI statistics",
    tags=["Admin Dashboard"],
)
async def get_admin_stats(current_admin: dict = Depends(get_current_admin_user)):
    """Retrieve top-level KPI metrics for the governance dashboard."""
    stats = AdminService.get_dashboard_stats()
    return stats


@router.get(
    "/complaints",
    summary="List complaints for admin routing",
    tags=["Admin Dashboard"],
)
async def get_admin_complaints(
    status: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    current_admin: dict = Depends(get_current_admin_user),
):
    """Get complaint table for administrative status update and department assignment."""
    complaints = AdminService.get_complaints(status=status, severity=severity, category=category, limit=limit)
    return complaints


@router.put(
    "/complaints/{issue_id}",
    summary="Update complaint status & department assignment",
    tags=["Admin Dashboard"],
)
async def update_complaint(
    issue_id: str,
    payload: dict,
    current_admin: dict = Depends(get_current_admin_user),
):
    """Assign department or update status (Pending, In Progress, Resolved)."""
    updated = AdminService.update_complaint(
        issue_id=issue_id,
        status=payload.get("status"),
        department=payload.get("assigned_department"),
        notes=payload.get("resolution_notes"),
    )
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    return updated


@router.get(
    "/users",
    summary="List community users for moderation",
    tags=["Admin Dashboard"],
)
async def get_admin_users(
    status: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    current_admin: dict = Depends(get_current_admin_user),
):
    """Retrieve registered users list for administrative moderation."""
    users = AdminService.get_users(status=status, role=role)
    return users


@router.put(
    "/users/{user_id}/status",
    summary="Update user moderation status (Active, Flagged, Suspended)",
    tags=["Admin Dashboard"],
)
async def update_user_status(
    user_id: str,
    payload: dict,
    current_admin: dict = Depends(get_current_admin_user),
):
    """Change user moderation state."""
    updated = AdminService.update_user_status(user_id=user_id, status=payload.get("status", "Active"))
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return updated


@router.get(
    "/analytics",
    summary="Get resolution velocity & departmental breakdown analytics",
    tags=["Admin Dashboard"],
)
async def get_analytics(
    range: str = Query("month"),
    current_admin: dict = Depends(get_current_admin_user),
):
    """Get analytical metrics for resolution velocity and departmental distribution."""
    analytics = AdminService.get_analytics(range=range)
    return analytics
