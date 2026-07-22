"""
Admin Dashboard service.

Platform administration, moderation logs, and analytics backed by Firestore.
"""

from typing import List, Dict, Any, Optional
from app.utils.firebase import get_document, set_document, query_collection
from app.models import Collections
from app.models.admin_action import create_admin_action_doc


class AdminService:
    @staticmethod
    def log_action(
        admin_id: str,
        action_type: str,
        target_type: str,
        target_id: str,
        reason: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Log an administrative action to Firestore."""
        doc = create_admin_action_doc(
            admin_id=admin_id,
            action_type=action_type,
            target_type=target_type,
            target_id=target_id,
            reason=reason,
            details=details,
            ip_address=ip_address,
        )
        set_document(Collections.ADMIN_ACTIONS, doc["id"], doc)
        return doc

    @staticmethod
    def get_platform_stats() -> Dict[str, Any]:
        """Aggregate total counts across Firestore collections."""
        users = query_collection(Collections.USERS)
        communities = query_collection(Collections.COMMUNITIES)
        posts = query_collection(Collections.POSTS, filters=[("is_deleted", "==", False)])
        civic_issues = query_collection(Collections.CIVIC_ISSUES, filters=[("is_deleted", "==", False)])
        lost_found = query_collection(Collections.LOST_FOUND, filters=[("is_deleted", "==", False)])
        marketplace = query_collection(Collections.MARKETPLACE, filters=[("is_deleted", "==", False)])
        jobs = query_collection(Collections.JOBS, filters=[("is_deleted", "==", False)])

        return {
            "total_users": len(users),
            "total_communities": len(communities),
            "total_posts": len(posts),
            "total_civic_issues": len(civic_issues),
            "total_lost_found_items": len(lost_found),
            "total_marketplace_listings": len(marketplace),
            "total_job_postings": len(jobs),
        }
