"""
AdminAction schemas for request/response validation.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class AdminActionCreate(BaseModel):
    """Schema for creating an admin action log entry."""
    action_type: str
    target_type: str
    target_id: UUID
    reason: Optional[str] = None
    details: Optional[dict] = None


class AdminActionResponse(BaseModel):
    """Schema for admin action API response."""
    id: UUID
    admin_id: UUID
    action_type: str
    target_type: str
    target_id: UUID
    reason: Optional[str] = None
    details: Optional[dict] = None
    ip_address: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
