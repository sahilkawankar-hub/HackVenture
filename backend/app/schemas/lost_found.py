"""
LostFoundItem schemas for Lost & Found feature.
"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel


class LostFoundItemCreate(BaseModel):
    """Schema for reporting a lost or found item."""
    item_type: str  # "lost" or "found"
    title: str
    description: str
    community_id: UUID
    category: Optional[str] = None
    image_urls: Optional[List[str]] = None
    location_description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    date_lost_found: Optional[datetime] = None


class LostFoundItemUpdate(BaseModel):
    """Schema for updating a lost/found item."""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None


class LostFoundItemResponse(BaseModel):
    """Schema for lost/found item API response."""
    id: UUID
    user_id: UUID
    community_id: UUID
    item_type: str
    title: str
    description: str
    category: Optional[str] = None
    image_urls: Optional[List[str]] = None
    location_description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: str
    date_lost_found: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class MatchSuggestion(BaseModel):
    """Schema for AI match suggestion."""
    item_id: UUID
    title: str
    similarity_score: float
    matched_item_type: str
