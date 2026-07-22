"""
MarketplaceListing schemas for Local Marketplace.
"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel


class MarketplaceListingCreate(BaseModel):
    """Schema for creating a marketplace listing."""
    title: str
    description: str
    community_id: UUID
    price: float
    currency: str = "INR"
    category: str
    condition: str = "good"
    image_urls: Optional[List[str]] = None


class MarketplaceListingUpdate(BaseModel):
    """Schema for updating a listing."""
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    condition: Optional[str] = None
    status: Optional[str] = None


class MarketplaceListingResponse(BaseModel):
    """Schema for listing API response."""
    id: UUID
    seller_id: UUID
    community_id: UUID
    title: str
    description: str
    price: float
    currency: str
    category: str
    condition: str
    image_urls: Optional[List[str]] = None
    status: str
    views_count: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
