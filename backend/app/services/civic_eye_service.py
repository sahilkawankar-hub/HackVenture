"""
CivicEye AI service.

Business logic for civic issue reporting with AI object detection, storage upload, and Firestore persistence.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from app.utils.firebase import get_document, set_document, query_collection
from app.utils.storage import upload_image
from app.models import Collections
from app.models.civic_issue import create_civic_issue_doc
from app.ai.civic_eye_model import civic_eye_detector


class CivicEyeService:
    @staticmethod
    def analyze_image(file_bytes: bytes) -> Dict[str, Any]:
        """Runs AI object detection on civic issue image bytes."""
        return civic_eye_detector.analyze_image(file_bytes)

    @staticmethod
    def upload_issue_image(file_bytes: bytes) -> Optional[str]:
        """Uploads image bytes to Firebase Storage under civic_eye directory."""
        return upload_image(file_bytes, folder="civic_eye")

    @staticmethod
    def report_issue(
        reporter_id: str,
        community_id: str,
        title: str,
        description: str,
        category: str,
        severity: str = "medium",
        image_urls: Optional[List[str]] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        address: Optional[str] = None,
        ai_detected_labels: Optional[List[str]] = None,
        ai_confidence: Optional[float] = None,
    ) -> Dict[str, Any]:
        """Report a new civic issue with AI metadata stored in Firestore."""
        doc = create_civic_issue_doc(
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
            ai_detected_labels=ai_detected_labels,
            ai_confidence=ai_confidence,
        )
        set_document(Collections.CIVIC_ISSUES, doc["id"], doc)
        return doc

    @staticmethod
    def get_issues(
        community_id: Optional[str] = None,
        status: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        """List civic issues filtered by community, status, and category."""
        filters = [("is_deleted", "==", False)]
        if community_id and community_id != "all":
            filters.append(("community_id", "==", community_id))
        if status and status != "all":
            filters.append(("status", "==", status))
        if category and category != "all":
            filters.append(("category", "==", category))

        issues = query_collection(
            Collections.CIVIC_ISSUES,
            filters=filters,
            order_by="created_at",
            limit=limit,
        )
        return issues

    @staticmethod
    def get_issue(issue_id: str) -> Optional[Dict[str, Any]]:
        """Get single issue by ID."""
        issue = get_document(Collections.CIVIC_ISSUES, issue_id)
        if issue and not issue.get("is_deleted", False):
            return issue
        return None

    @staticmethod
    def update_issue_status(
        issue_id: str,
        status: str,
        resolution_notes: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """Update issue status (open -> in_progress -> resolved -> closed)."""
        issue = CivicEyeService.get_issue(issue_id)
        if not issue:
            return None

        issue["status"] = status
        issue["updated_at"] = datetime.now(timezone.utc).isoformat()
        if resolution_notes:
            issue["resolution_notes"] = resolution_notes
        if status == "resolved":
            issue["resolved_at"] = datetime.now(timezone.utc).isoformat()

        set_document(Collections.CIVIC_ISSUES, issue_id, issue)
        return issue

    @staticmethod
    def upvote_issue(issue_id: str) -> Optional[Dict[str, Any]]:
        """Increment issue upvote count."""
        issue = CivicEyeService.get_issue(issue_id)
        if not issue:
            return None

        issue["upvote_count"] = issue.get("upvote_count", 0) + 1
        set_document(Collections.CIVIC_ISSUES, issue_id, issue)
        return issue
