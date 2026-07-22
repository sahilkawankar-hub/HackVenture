"""
Post schemas for Community Feed.
"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel


class PostCreate(BaseModel):
    """Schema for creating a new post."""
    content: str
    community_id: UUID
    media_urls: Optional[List[str]] = None
    category: Optional[str] = None


class PostUpdate(BaseModel):
    """Schema for updating a post."""
    content: Optional[str] = None
    category: Optional[str] = None


class PostResponse(BaseModel):
    """Schema for post API response."""
    id: UUID
    author_id: UUID
    community_id: UUID
    content: str
    media_urls: Optional[List[str]] = None
    category: Optional[str] = None
    like_count: int
    comment_count: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CommentCreate(BaseModel):
    """Schema for adding a comment."""
    content: str


class CommentResponse(BaseModel):
    """Schema for comment API response."""
    id: UUID
    post_id: UUID
    author_id: UUID
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}
