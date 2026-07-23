"""
CivicIssue schemas for CivicEye AI.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class BoundingBox(BaseModel):
    box: List[float]
    label: str
    confidence: float


class AIDetectionResponse(BaseModel):
    """Response schema for AI issue detection endpoint."""
    detected_issue: str
    confidence_score: float
    suggested_category: str
    priority: str = Field(description="low | medium | high | critical")
    labels: List[str] = Field(default_factory=list)
    bounding_boxes: Optional[List[Dict[str, Any]]] = None


class CivicIssueCreate(BaseModel):
    """Schema for reporting a civic issue."""
    title: str
    description: str
    community_id: str = Field(default="community_default")
    category: str
    severity: str = Field(default="medium", description="low | medium | high | critical")
    image_url: Optional[str] = None
    image_urls: Optional[List[str]] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    ai_detected_labels: Optional[List[str]] = None
    ai_confidence: Optional[float] = None


class CivicIssueStatusUpdate(BaseModel):
    """Schema for updating a civic issue status."""
    status: str = Field(description="open | in_progress | resolved | closed")
    resolution_notes: Optional[str] = None


class CivicIssueResponse(BaseModel):
    """Schema for civic issue API response."""
    id: str
    reporter_id: str
    community_id: str
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
    upvote_count: int = 0
    created_at: str
    resolved_at: Optional[str] = None
    resolution_notes: Optional[str] = None

    model_config = {"from_attributes": True}
