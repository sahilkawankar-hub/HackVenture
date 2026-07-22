"""
Lost & Found service.

Business logic for lost/found items and AI-powered semantic matching backed by Firestore.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from app.utils.firebase import get_document, set_document, query_collection
from app.models import Collections
from app.models.lost_found_item import create_lost_found_doc


class LostFoundService:
    @staticmethod
    def report_item(
        user_id: str,
        community_id: str,
        item_type: str,
        title: str,
        description: str,
        category: Optional[str] = None,
        image_urls: Optional[List[str]] = None,
        ai_embedding: Optional[List[float]] = None,
        location_description: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        contact_info: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Report a lost or found item."""
        doc = create_lost_found_doc(
            user_id=user_id,
            community_id=community_id,
            item_type=item_type,
            title=title,
            description=description,
            category=category,
            image_urls=image_urls,
            ai_embedding=ai_embedding,
            location_description=location_description,
            latitude=latitude,
            longitude=longitude,
            contact_info=contact_info,
        )
        set_document(Collections.LOST_FOUND, doc["id"], doc)
        return doc

    @staticmethod
    def get_items(
        community_id: str,
        item_type: Optional[str] = None,
        status: str = "active",
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """List lost/found items."""
        filters = [("community_id", "==", community_id), ("is_deleted", "==", False)]
        if item_type:
            filters.append(("item_type", "==", item_type))
        if status:
            filters.append(("status", "==", status))

        return query_collection(
            Collections.LOST_FOUND,
            filters=filters,
            order_by="created_at",
            limit=limit,
        )

    @staticmethod
    def get_item(item_id: str) -> Optional[Dict[str, Any]]:
        """Get lost/found item by ID."""
        item = get_document(Collections.LOST_FOUND, item_id)
        if item and not item.get("is_deleted", False):
            return item
        return None

    @staticmethod
    def find_matches(item_id: str, threshold: float = 0.7) -> List[Dict[str, Any]]:
        """
        Find potential AI-matched items in the complementary category (lost <-> found).
        """
        target_item = LostFoundService.get_item(item_id)
        if not target_item:
            return []

        opposite_type = "found" if target_item.get("item_type") == "lost" else "lost"
        candidates = LostFoundService.get_items(
            community_id=target_item.get("community_id"),
            item_type=opposite_type,
            status="active",
        )

        matches = []
        for candidate in candidates:
            # Basic text-overlap / category matching algorithm
            score = 0.5
            if candidate.get("category") == target_item.get("category"):
                score += 0.3
            if target_item.get("title", "").lower() in candidate.get("description", "").lower():
                score += 0.2

            if score >= threshold:
                matches.append({
                    "item_id": candidate["id"],
                    "title": candidate["title"],
                    "similarity_score": round(score, 2),
                    "matched_item_type": candidate["item_type"],
                })
        return matches
