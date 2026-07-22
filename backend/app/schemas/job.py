"""
JobPosting schemas for Local Jobs feature.
"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel


class JobPostingCreate(BaseModel):
    """Schema for creating a job posting."""
    title: str
    description: str
    community_id: UUID
    job_type: str
    category: str
    pay_range: Optional[str] = None
    location: Optional[str] = None
    requirements: Optional[List[str]] = None
    expires_at: Optional[datetime] = None


class JobPostingUpdate(BaseModel):
    """Schema for updating a job posting."""
    title: Optional[str] = None
    description: Optional[str] = None
    pay_range: Optional[str] = None
    status: Optional[str] = None
    requirements: Optional[List[str]] = None


class JobPostingResponse(BaseModel):
    """Schema for job posting API response."""
    id: UUID
    poster_id: UUID
    community_id: UUID
    title: str
    description: str
    job_type: str
    category: str
    pay_range: Optional[str] = None
    location: Optional[str] = None
    requirements: Optional[List[str]] = None
    status: str
    application_count: int
    created_at: datetime
    expires_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class JobApplicationCreate(BaseModel):
    """Schema for applying to a job."""
    cover_note: Optional[str] = None


class JobApplicationResponse(BaseModel):
    """Schema for job application API response."""
    id: UUID
    job_id: UUID
    applicant_id: UUID
    cover_note: Optional[str] = None
    status: str
    applied_at: datetime

    model_config = {"from_attributes": True}
