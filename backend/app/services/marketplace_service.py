"""
Marketplace service.

Business logic for local marketplace listings backed by Firestore.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from app.utils.firebase import get_document, set_document, query_collection
from app.models import Collections
from app.models.marketplace_listing import create_marketplace_doc


class MarketplaceService:
    @staticmethod
    def create_listing(
        seller_id: str,
        community_id: str,
        title: str,
        description: str,
        price: float,
        currency: str = "INR",
        category: str = "Other",
        condition: str = "good",
        image_urls: Optional[List[str]] = None,
        is_negotiable: bool = True,
    ) -> Dict[str, Any]:
        """Create a marketplace listing."""
        doc = create_marketplace_doc(
            seller_id=seller_id,
            community_id=community_id,
            title=title,
            description=description,
            price=price,
            currency=currency,
            category=category,
            condition=condition,
            image_urls=image_urls,
            is_negotiable=is_negotiable,
        )
        set_document(Collections.MARKETPLACE, doc["id"], doc)
        return doc

    @staticmethod
    def get_listings(
        community_id: str,
        category: Optional[str] = None,
        status: str = "active",
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """Get marketplace listings for a community."""
        filters = [("community_id", "==", community_id), ("is_deleted", "==", False)]
        if category:
            filters.append(("category", "==", category))
        if status:
            filters.append(("status", "==", status))

        return query_collection(
            Collections.MARKETPLACE,
            filters=filters,
            order_by="created_at",
            limit=limit,
        )

    @staticmethod
    def get_listing(listing_id: str) -> Optional[Dict[str, Any]]:
        """Get listing by ID and increment view count."""
        listing = get_document(Collections.MARKETPLACE, listing_id)
        if listing and not listing.get("is_deleted", False):
            listing["views_count"] = listing.get("views_count", 0) + 1
            set_document(Collections.MARKETPLACE, listing_id, listing)
            return listing
        return None
