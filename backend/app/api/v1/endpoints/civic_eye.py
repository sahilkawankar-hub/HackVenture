"""
CivicEye AI endpoints.

AI-powered civic issue reporting, YOLO road damage detection,
annotated image output, storage uploads, and status tracking.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException, Query, status

from app.schemas.civic_issue import (
    AIDetectionResponse,
    ModelStatusResponse,
    CivicIssueResponse,
    CivicIssueCreate,
    CivicIssueStatusUpdate,
)
from app.services.civic_eye_service import CivicEyeService
from app.core.dependencies import get_current_user

router = APIRouter()


# ── Model Status ──────────────────────────────────────────────────────────────

@router.get(
    "/model-status",
    response_model=ModelStatusResponse,
    summary="Get AI model load status",
    tags=["CivicEye AI"],
)
async def get_model_status():
    """
    Returns whether the Road Damage YOLO model has finished loading,
    which model source is active, and the available class names.

    `model_source` values:
    - `huggingface_road_damage` — nsr51324/Road_Damage_Object_Detection (best)
    - `yolov8n_coco`            — generic COCO fallback
    - `heuristic`               — deterministic rule engine (offline demo)
    - `loading`                 — model is still being downloaded
    """
    return ModelStatusResponse(**CivicEyeService.get_model_status())


# ── Detection ──────────────────────────────────────────────────────────────────

@router.post(
    "/detect",
    response_model=AIDetectionResponse,
    summary="Analyze image with Road Damage YOLO model",
    tags=["CivicEye AI"],
)
async def detect_civic_issue(file: UploadFile = File(...)):
    """
    Upload an image to run Road Damage YOLO object detection.

    Returns:
    - `detected_issue`       — primary detected problem
    - `confidence_score`     — model confidence (0–1)
    - `suggested_category`   — civic category suggestion
    - `priority`             — low | medium | high | critical
    - `labels`               — all unique detected labels
    - `bounding_boxes`       — list of box coordinates + per-box info
    - `model_source`         — which model produced the result
    - `annotated_image_b64`  — base-64 JPEG with boxes drawn on image
    - `total_detections`     — number of detected objects
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image (JPEG / PNG / WebP)",
        )

    try:
        contents = await file.read()
        result = CivicEyeService.analyze_image(contents)
        return AIDetectionResponse(**result)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI detection failed: {exc}",
        )


# ── Report (multipart form + optional file) ────────────────────────────────────

@router.post(
    "/report",
    response_model=CivicIssueResponse,
    summary="Report a civic complaint with image & AI auto-detection",
    tags=["CivicEye AI"],
)
async def report_civic_issue(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    severity: str = Form("medium"),
    community_id: str = Form("community_default"),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    address: Optional[str] = Form(None),
    ai_detected_labels: Optional[str] = Form(None),   # comma-separated string
    ai_confidence: Optional[float] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user),
):
    """
    Report a new civic issue.

    - reporter_id is extracted from the authenticated JWT token, not from form data.
    - If an image is uploaded and no AI labels are provided, the Road Damage
      YOLO model runs automatically to fill in category, severity, and labels.
    - The image is uploaded to cloud storage; the public URL is saved with
      the issue record in Supabase.
    """
    reporter_id = current_user.get("user_id", "anonymous_user")
    image_url: Optional[str] = None
    labels_list: List[str] = []
    confidence = ai_confidence
    bounding_boxes = None
    model_source = None
    ai_metadata = None

    if file:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image (JPEG / PNG / WebP)",
            )
        contents = await file.read()

        # Upload to cloud storage
        image_url = CivicEyeService.upload_issue_image(contents)

        # Auto-detect if the client didn't supply labels already
        if not ai_detected_labels or confidence is None:
            ai_res = CivicEyeService.analyze_image(contents)
            labels_list = ai_res.get("labels", [])
            confidence = ai_res.get("confidence_score", 0.0)
            bounding_boxes = ai_res.get("bounding_boxes")
            model_source = ai_res.get("model_source")
            ai_metadata = ai_res.get("ai_metadata")

            # Let the AI override category / severity when defaults are used
            if not category or category in ("Other", ""):
                category = ai_res.get("suggested_category", category)
            if not severity or severity == "medium":
                severity = ai_res.get("priority", severity)

    # Parse comma-separated labels string if supplied by client
    if ai_detected_labels and not labels_list:
        labels_list = [lbl.strip() for lbl in ai_detected_labels.split(",") if lbl.strip()]

    image_urls = [image_url] if image_url else []

    doc = CivicEyeService.report_issue(
        reporter_id=reporter_id,
        community_id=community_id,
        title=title,
        description=description,
        category=category,
        severity=severity,
        image_urls=image_urls,
        latitude=latitude,
        longitude=longitude,
        address=address,
        ai_detected_labels=labels_list,
        ai_confidence=confidence,
        ai_bounding_boxes=bounding_boxes,
        model_source=model_source,
        ai_metadata=ai_metadata if file else None,
    )
    return CivicIssueResponse(**doc)


# ── Report via JSON (no file upload) ─────────────────────────────────────────

@router.post(
    "/report-json",
    response_model=CivicIssueResponse,
    summary="Report civic issue via JSON payload (no file upload)",
    tags=["CivicEye AI"],
)
async def report_civic_issue_json(
    payload: CivicIssueCreate,
    current_user: dict = Depends(get_current_user),
):
    """Fallback JSON endpoint for creating a civic issue without direct file upload."""
    reporter_id = current_user.get("user_id", "anonymous_user")
    doc = CivicEyeService.report_issue(
        reporter_id=reporter_id,
        community_id=payload.community_id,
        title=payload.title,
        description=payload.description,
        category=payload.category,
        severity=payload.severity,
        image_urls=[payload.image_url] if payload.image_url else (payload.image_urls or []),
        latitude=payload.latitude,
        longitude=payload.longitude,
        address=payload.address,
        ai_detected_labels=payload.ai_detected_labels,
        ai_confidence=payload.ai_confidence,
        ai_metadata=payload.ai_metadata,
    )
    return CivicIssueResponse(**doc)


# ── Issue CRUD ─────────────────────────────────────────────────────────────────

@router.get(
    "/issues",
    response_model=List[CivicIssueResponse],
    summary="List civic issues",
    tags=["CivicEye Issues"],
)
async def get_civic_issues(
    community_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
):
    """List reported civic issues filtered by community, status, and category."""
    issues = CivicEyeService.get_issues(
        community_id=community_id,
        status=status,
        category=category,
        limit=limit,
    )
    return [CivicIssueResponse(**item) for item in issues]


@router.get(
    "/issues/{issue_id}",
    response_model=CivicIssueResponse,
    summary="Get issue details",
    tags=["CivicEye Issues"],
)
async def get_civic_issue(issue_id: str):
    """Retrieve full details for a specific civic issue."""
    issue = CivicEyeService.get_issue(issue_id)
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Civic issue '{issue_id}' not found.",
        )
    return CivicIssueResponse(**issue)


@router.put(
    "/issues/{issue_id}/status",
    response_model=CivicIssueResponse,
    summary="Update issue status",
    tags=["CivicEye Issues"],
)
async def update_issue_status(issue_id: str, payload: CivicIssueStatusUpdate):
    """Update issue status (open → in_progress → resolved → closed)."""
    updated = CivicEyeService.update_issue_status(
        issue_id=issue_id,
        status=payload.status,
        resolution_notes=payload.resolution_notes,
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Civic issue '{issue_id}' not found.",
        )
    return CivicIssueResponse(**updated)


@router.post(
    "/issues/{issue_id}/upvote",
    response_model=CivicIssueResponse,
    summary="Upvote an issue",
    tags=["CivicEye Issues"],
)
async def upvote_civic_issue(issue_id: str):
    """Upvote a civic issue to increase its priority visibility."""
    updated = CivicEyeService.upvote_issue(issue_id)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Civic issue '{issue_id}' not found.",
        )
    return CivicIssueResponse(**updated)
