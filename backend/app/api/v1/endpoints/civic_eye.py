"""
CivicEye AI endpoints.

AI-powered civic issue reporting, YOLO detection, storage uploads, and status tracking.
"""

from typing import List, Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Query, status

from app.schemas.civic_issue import (
    AIDetectionResponse,
    CivicIssueResponse,
    CivicIssueCreate,
    CivicIssueStatusUpdate,
)
from app.services.civic_eye_service import CivicEyeService

router = APIRouter()


@router.post("/detect", response_model=AIDetectionResponse, summary="Analyze image with YOLO AI model")
async def detect_civic_issue(file: UploadFile = File(...)):
    """
    Upload image file to run YOLO object detection and return:
    - detected_issue
    - confidence_score
    - suggested_category
    - priority
    - labels
    - bounding_boxes
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File provided must be an image (JPEG/PNG/WebP)",
        )

    try:
        contents = await file.read()
        detection_result = CivicEyeService.analyze_image(contents)
        return AIDetectionResponse(**detection_result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI image detection failed: {str(e)}",
        )


@router.post("/report", response_model=CivicIssueResponse, summary="Report a civic complaint with image & AI")
async def report_civic_issue(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    severity: str = Form("medium"),
    community_id: str = Form("community_default"),
    reporter_id: str = Form("anonymous_user"),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    address: Optional[str] = Form(None),
    ai_detected_labels: Optional[str] = Form(None),  # Comma-separated or JSON string
    ai_confidence: Optional[float] = Form(None),
    file: Optional[UploadFile] = File(None),
):
    """
    Report a new civic issue.
    Uploads complaint image to Firebase Storage, executes YOLO AI model if labels not supplied,
    and saves complete record to Firestore.
    """
    image_url = None
    labels_list = []
    confidence = ai_confidence

    if file:
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File provided must be an image",
            )
        contents = await file.read()
        image_url = CivicEyeService.upload_issue_image(contents)

        # Run AI detection if labels weren't explicitly sent from client scanning step
        if not ai_detected_labels or confidence is None:
            ai_res = CivicEyeService.analyze_image(contents)
            labels_list = ai_res.get("labels", [])
            confidence = ai_res.get("confidence_score", 0.90)
            if not category or category == "Other":
                category = ai_res.get("suggested_category", category)
            if not severity or severity == "medium":
                severity = ai_res.get("priority", severity)

    if ai_detected_labels and not labels_list:
        labels_list = [label.strip() for label in ai_detected_labels.split(",") if label.strip()]

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
    )
    return CivicIssueResponse(**doc)


@router.post("/report-json", response_model=CivicIssueResponse, summary="Report civic issue via JSON payload")
async def report_civic_issue_json(payload: CivicIssueCreate):
    """Fallback JSON endpoint for creating civic issue without direct file upload."""
    doc = CivicEyeService.report_issue(
        reporter_id="user_demo_id",
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
    )
    return CivicIssueResponse(**doc)


@router.get("/issues", response_model=List[CivicIssueResponse], summary="List civic issues")
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


@router.get("/issues/{issue_id}", response_model=CivicIssueResponse, summary="Get issue details")
async def get_civic_issue(issue_id: str):
    """Retrieve details for a specific civic issue."""
    issue = CivicEyeService.get_issue(issue_id)
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Civic issue with ID '{issue_id}' not found.",
        )
    return CivicIssueResponse(**issue)


@router.put("/issues/{issue_id}/status", response_model=CivicIssueResponse, summary="Update issue status")
async def update_issue_status(issue_id: str, payload: CivicIssueStatusUpdate):
    """Update issue status (e.g. open -> in_progress -> resolved)."""
    updated = CivicEyeService.update_issue_status(
        issue_id=issue_id,
        status=payload.status,
        resolution_notes=payload.resolution_notes,
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Civic issue with ID '{issue_id}' not found.",
        )
    return CivicIssueResponse(**updated)


@router.post("/issues/{issue_id}/upvote", response_model=CivicIssueResponse, summary="Upvote an issue")
async def upvote_civic_issue(issue_id: str):
    """Upvote a civic issue to increase its priority visibility."""
    updated = CivicEyeService.upvote_issue(issue_id)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Civic issue with ID '{issue_id}' not found.",
        )
    return CivicIssueResponse(**updated)
