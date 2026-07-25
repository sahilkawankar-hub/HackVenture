"""
Notifications API endpoints.
Provides notification listing, mark as read, delete, and unread count metrics.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.services.notification_service import NotificationService
from app.core.dependencies import get_current_user

router = APIRouter()


@router.get(
    "",
    summary="List notifications for current user",
    tags=["Notifications"],
)
async def list_notifications(
    is_read: Optional[bool] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    """Retrieve notifications for the authenticated user."""
    user_id = current_user.get("user_id", "demo_user")
    notifications = NotificationService.get_notifications(user_id=user_id, is_read=is_read, limit=limit)
    return notifications


@router.get(
    "/unread-count",
    summary="Get count of unread notifications",
    tags=["Notifications"],
)
async def get_unread_count(current_user: dict = Depends(get_current_user)):
    """Get the badge number of unread notifications."""
    user_id = current_user.get("user_id", "demo_user")
    count = NotificationService.get_unread_count(user_id)
    return {"count": count}


@router.put(
    "/{notification_id}/read",
    summary="Mark single notification as read",
    tags=["Notifications"],
)
async def mark_notification_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Mark a notification as read."""
    updated = NotificationService.mark_read(notification_id)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return updated


@router.put(
    "/read-all",
    summary="Mark all notifications as read",
    tags=["Notifications"],
)
async def mark_all_notifications_read(current_user: dict = Depends(get_current_user)):
    """Mark all notifications as read for current user."""
    user_id = current_user.get("user_id", "demo_user")
    NotificationService.mark_all_read(user_id)
    return {"message": "All notifications marked as read"}


@router.delete(
    "/{notification_id}",
    summary="Delete a notification",
    tags=["Notifications"],
)
async def delete_notification(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a notification."""
    NotificationService.delete(notification_id)
    return {"message": "Notification deleted"}
