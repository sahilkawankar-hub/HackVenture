"""
Local Jobs endpoints.

Post and discover local job opportunities within the community.
"""

import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from app.core.dependencies import get_current_user
from app.utils.firebase import get_document, set_document, query_collection
from app.models import Collections

router = APIRouter()


# ── Schemas ───────────────────────────────────────────────────────────────────

class JobCreate(BaseModel):
    title: str
    description: str
    rate: str
    job_type: str = "Flexible"
    category: str
    community_id: str = "community_default"
    requirements: Optional[List[str]] = None


class ApplicationCreate(BaseModel):
    cover_note: str


class JobResponse(BaseModel):
    id: str
    poster_id: str
    poster_name: Optional[str] = None
    title: str
    description: str
    rate: str
    job_type: str
    category: str
    community_id: str
    requirements: List[str] = []
    application_count: int = 0
    is_filled: bool = False
    created_at: str
    updated_at: Optional[str] = None

    model_config = {"from_attributes": True}


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.get("/postings", response_model=List[JobResponse], summary="List job postings")
async def list_jobs(
    community_id: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    job_type: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
):
    """List available local job postings."""
    filters = [("is_deleted", "==", False), ("is_filled", "==", False)]
    if community_id:
        filters.append(("community_id", "==", community_id))
    if category and category != "All":
        filters.append(("category", "==", category))
    if job_type and job_type != "All":
        filters.append(("job_type", "==", job_type))

    jobs = query_collection(Collections.JOB_POSTINGS, filters=filters, order_by="created_at", limit=limit)
    return [JobResponse(**j) for j in jobs]


@router.post("/postings", response_model=JobResponse, status_code=status.HTTP_201_CREATED, summary="Create a job posting")
async def create_job(payload: JobCreate, current_user: dict = Depends(get_current_user)):
    """Create a new job or gig posting."""
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "poster_id": current_user["user_id"],
        "poster_name": current_user.get("name") or current_user.get("email", ""),
        "title": payload.title,
        "description": payload.description,
        "rate": payload.rate,
        "job_type": payload.job_type,
        "category": payload.category,
        "community_id": payload.community_id,
        "requirements": payload.requirements or [],
        "application_count": 0,
        "is_filled": False,
        "is_deleted": False,
        "created_at": now,
        "updated_at": now,
    }
    set_document(Collections.JOB_POSTINGS, doc["id"], doc)
    return JobResponse(**doc)


@router.get("/postings/{job_id}", response_model=JobResponse, summary="Get job details")
async def get_job(job_id: str):
    """Get a single job posting."""
    job = get_document(Collections.JOB_POSTINGS, job_id)
    if not job or job.get("is_deleted"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job posting not found")
    return JobResponse(**job)


@router.delete("/postings/{job_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Remove a job posting")
async def delete_job(job_id: str, current_user: dict = Depends(get_current_user)):
    """Soft-delete a job posting (poster or admin only)."""
    job = get_document(Collections.JOB_POSTINGS, job_id)
    if not job or job.get("is_deleted"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job posting not found")
    if job["poster_id"] != current_user["user_id"] and not current_user.get("is_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    job["is_deleted"] = True
    job["updated_at"] = datetime.now(timezone.utc).isoformat()
    set_document(Collections.JOB_POSTINGS, job_id, job)


@router.post("/postings/{job_id}/apply", summary="Apply to a job")
async def apply_to_job(
    job_id: str,
    payload: ApplicationCreate,
    current_user: dict = Depends(get_current_user),
):
    """Submit an application for a local job posting."""
    job = get_document(Collections.JOB_POSTINGS, job_id)
    if not job or job.get("is_deleted") or job.get("is_filled"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found or already filled")
    now = datetime.now(timezone.utc).isoformat()
    application = {
        "id": str(uuid.uuid4()),
        "job_id": job_id,
        "applicant_id": current_user["user_id"],
        "applicant_name": current_user.get("name") or current_user.get("email", ""),
        "cover_note": payload.cover_note,
        "status": "pending",
        "created_at": now,
    }
    application_collection_id = f"applications_{job_id}"
    set_document(application_collection_id, application["id"], application)
    job["application_count"] = job.get("application_count", 0) + 1
    job["updated_at"] = now
    set_document(Collections.JOB_POSTINGS, job_id, job)
    return application
