"""
CivicIssue schemas for CivicEye AI.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


# ── Detection / AI Schemas ────────────────────────────────────────────────────

class BoundingBox(BaseModel):
    """A single detected object's bounding box."""
    box: List[float] = Field(description="[x1, y1, x2, y2] pixel coordinates")
    label: str
    confidence: float
    priority: Optional[str] = None


class AIDetectionResponse(BaseModel):
    """Response schema for the AI image detection endpoint."""
    model_config = {"protected_namespaces": ()}

    detected_issue: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    suggested_category: str
    priority: str = Field(description="low | medium | high | critical")
    labels: List[str] = Field(default_factory=list)
    bounding_boxes: Optional[List[Dict[str, Any]]] = None
    model_source: Optional[str] = Field(
        default=None,
        description="Which model produced this result: huggingface_road_damage | yolov8n_coco | heuristic",
    )
    annotated_image_b64: Optional[str] = Field(
        default=None,
        description="Base-64 encoded JPEG of the image with bounding boxes drawn",
    )
    total_detections: int = Field(default=0)
    ai_metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Additional AI outputs such as OCR, segmentation, text sentiment, and summaries",
    )


class ModelStatusResponse(BaseModel):
    """Response schema for the AI model status endpoint."""
    model_config = {"protected_namespaces": ()}

    is_ready: bool
    model_source: str = Field(
        description="huggingface_road_damage | yolov8n_coco | heuristic | loading"
    )
    model_classes: List[str] = Field(default_factory=list)
    error: Optional[str] = None


# ── Issue CRUD Schemas ────────────────────────────────────────────────────────

class CivicIssueCreate(BaseModel):
    """Schema for reporting a civic issue via JSON body."""
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
    ai_metadata: Optional[Dict[str, Any]] = None


class CivicIssueStatusUpdate(BaseModel):
    """Schema for updating a civic issue status."""
    status: str = Field(description="open | in_progress | resolved | closed")
    resolution_notes: Optional[str] = None


class CivicIssueResponse(BaseModel):
    """Schema for civic issue API response."""
    model_config = {"protected_namespaces": ()}

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
    ai_bounding_boxes: Optional[List[Dict[str, Any]]] = None
    model_source: Optional[str] = None
    ai_metadata: Optional[Dict[str, Any]] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    upvote_count: int = 0
    created_at: str
    updated_at: Optional[str] = None
    resolved_at: Optional[str] = None
    resolution_notes: Optional[str] = None

    model_config = {"from_attributes": True}
