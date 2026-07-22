"""
Local Jobs service.

Business logic for job postings and applications backed by Firestore.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from app.utils.firebase import get_document, set_document, query_collection
from app.models import Collections
from app.models.job_posting import create_job_posting_doc, create_job_application_doc


class JobsService:
    @staticmethod
    def create_job_posting(
        poster_id: str,
        community_id: str,
        title: str,
        description: str,
        job_type: str,
        category: str,
        pay_range: Optional[str] = None,
        location: Optional[str] = None,
        requirements: Optional[List[str]] = None,
        contact_email: Optional[str] = None,
        contact_phone: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Create a new job posting."""
        doc = create_job_posting_doc(
            poster_id=poster_id,
            community_id=community_id,
            title=title,
            description=description,
            job_type=job_type,
            category=category,
            pay_range=pay_range,
            location=location,
            requirements=requirements,
            contact_email=contact_email,
            contact_phone=contact_phone,
        )
        set_document(Collections.JOBS, doc["id"], doc)
        return doc

    @staticmethod
    def get_job_postings(
        community_id: str,
        job_type: Optional[str] = None,
        status: str = "open",
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """List job postings for a community."""
        filters = [("community_id", "==", community_id), ("is_deleted", "==", False)]
        if job_type:
            filters.append(("job_type", "==", job_type))
        if status:
            filters.append(("status", "==", status))

        return query_collection(
            Collections.JOBS,
            filters=filters,
            order_by="created_at",
            limit=limit,
        )

    @staticmethod
    def apply_to_job(
        job_id: str,
        applicant_id: str,
        cover_note: Optional[str] = None,
        resume_url: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """Submit a job application."""
        job = get_document(Collections.JOBS, job_id)
        if not job or job.get("is_deleted", False):
            return None

        app_doc = create_job_application_doc(
            job_id=job_id,
            applicant_id=applicant_id,
            cover_note=cover_note,
            resume_url=resume_url,
        )

        applications = job.get("applications", [])
        applications.append(app_doc)
        job["applications"] = applications
        job["application_count"] = len(applications)
        job["updated_at"] = datetime.now(timezone.utc).isoformat()

        set_document(Collections.JOBS, job_id, job)
        return app_doc
