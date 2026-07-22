"""
CivicIssue schemas for CivicEye AI.
"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel


class CivicIssueCreate(BaseModel):
    """Schema for reporting a civic issue."""
    title: str
    description: str
    community_id: UUID
    category: str
    severity: str = "medium"
    image_urls: Optional[List[str]] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None


class CivicIssueUpdate(BaseModel):
    """Schema for updating a civic issue."""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    severity: Optional[str] = None


class CivicIssueResponse(BaseModel):
    """Schema for civic issue API response."""
    id: UUID
    reporter_id: UUID
    community_id: UUID
    title: str
    description: str
    category: str
    severity: str
    status: str
    image_urls: Optional[List[str]] = None
    ai_detected_labels: Optional[List[str]] = None
    ai_confidence: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    upvote_count: int
    created_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
