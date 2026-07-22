"""
User schemas for request/response validation.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Shared user properties."""
    email: EmailStr
    display_name: str
    photo_url: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None


class UserCreate(BaseModel):
    """Schema for user registration via Firebase."""
    firebase_uid: str
    email: EmailStr
    display_name: str
    photo_url: Optional[str] = None


class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None


class UserResponse(UserBase):
    """Schema for user API response."""
    id: UUID
    is_admin: bool
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    """Schema for auth token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
