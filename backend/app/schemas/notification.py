"""
Notification schemas for request/response validation.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class NotificationResponse(BaseModel):
    """Schema for notification API response."""
    id: UUID
    user_id: UUID
    notification_type: str
    title: str
    message: str
    is_read: bool
    source_type: Optional[str] = None
    source_id: Optional[UUID] = None
    actor_id: Optional[UUID] = None
    created_at: datetime
    read_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class NotificationMarkRead(BaseModel):
    """Schema for marking notifications as read."""
    notification_ids: list[UUID]
