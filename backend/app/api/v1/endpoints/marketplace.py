"""
Local Marketplace endpoints.

Buy, sell, and trade items within the community.
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

class ListingCreate(BaseModel):
    title: str
    description: str
    price: float
    category: str
    condition: str = "Good"
    image_url: Optional[str] = None
    community_id: str = "community_default"


class ListingResponse(BaseModel):
    id: str
    seller_id: str
    seller_name: Optional[str] = None
    title: str
    description: str
    price: float
    category: str
    condition: str
    image_url: Optional[str] = None
    community_id: str
    is_sold: bool = False
    created_at: str
    updated_at: Optional[str] = None

    model_config = {"from_attributes": True}


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.get("/listings", response_model=List[ListingResponse], summary="List marketplace items")
async def list_listings(
    community_id: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
):
    """List active marketplace listings."""
    filters = [("is_deleted", "==", False), ("is_sold", "==", False)]
    if community_id:
        filters.append(("community_id", "==", community_id))
    if category and category != "All":
        filters.append(("category", "==", category))

    listings = query_collection(Collections.MARKETPLACE_LISTINGS, filters=filters, order_by="created_at", limit=limit)
    return [ListingResponse(**item) for item in listings]


@router.post("/listings", response_model=ListingResponse, status_code=status.HTTP_201_CREATED, summary="Create a listing")
async def create_listing(payload: ListingCreate, current_user: dict = Depends(get_current_user)):
    """Create a new marketplace listing."""
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "seller_id": current_user["user_id"],
        "seller_name": current_user.get("name") or current_user.get("email", ""),
        "title": payload.title,
        "description": payload.description,
        "price": payload.price,
        "category": payload.category,
        "condition": payload.condition,
        "image_url": payload.image_url,
        "community_id": payload.community_id,
        "is_sold": False,
        "is_deleted": False,
        "interested_by": [],
        "created_at": now,
        "updated_at": now,
    }
    set_document(Collections.MARKETPLACE_LISTINGS, doc["id"], doc)
    return ListingResponse(**doc)


@router.get("/listings/{listing_id}", response_model=ListingResponse, summary="Get listing details")
async def get_listing(listing_id: str):
    """Get a single marketplace listing."""
    item = get_document(Collections.MARKETPLACE_LISTINGS, listing_id)
    if not item or item.get("is_deleted"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    return ListingResponse(**item)


@router.put("/listings/{listing_id}/sold", response_model=ListingResponse, summary="Mark listing as sold")
async def mark_sold(listing_id: str, current_user: dict = Depends(get_current_user)):
    """Mark a listing as sold (seller only)."""
    item = get_document(Collections.MARKETPLACE_LISTINGS, listing_id)
    if not item or item.get("is_deleted"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    if item["seller_id"] != current_user["user_id"] and not current_user.get("is_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    item["is_sold"] = True
    item["updated_at"] = datetime.now(timezone.utc).isoformat()
    set_document(Collections.MARKETPLACE_LISTINGS, listing_id, item)
    return ListingResponse(**item)


@router.delete("/listings/{listing_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Remove a listing")
async def delete_listing(listing_id: str, current_user: dict = Depends(get_current_user)):
    """Soft-delete a marketplace listing (seller or admin only)."""
    item = get_document(Collections.MARKETPLACE_LISTINGS, listing_id)
    if not item or item.get("is_deleted"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    if item["seller_id"] != current_user["user_id"] and not current_user.get("is_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    item["is_deleted"] = True
    item["updated_at"] = datetime.now(timezone.utc).isoformat()
    set_document(Collections.MARKETPLACE_LISTINGS, listing_id, item)


@router.post("/listings/{listing_id}/interest", summary="Express interest in a listing")
async def express_interest(listing_id: str, current_user: dict = Depends(get_current_user)):
    """Register interest in a marketplace listing."""
    item = get_document(Collections.MARKETPLACE_LISTINGS, listing_id)
    if not item or item.get("is_deleted") or item.get("is_sold"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found or unavailable")
    uid = current_user["user_id"]
    interested = item.get("interested_by", [])
    if uid not in interested:
        interested.append(uid)
        item["interested_by"] = interested
        item["updated_at"] = datetime.now(timezone.utc).isoformat()
        set_document(Collections.MARKETPLACE_LISTINGS, listing_id, item)
    return {"message": "Interest registered", "listing_id": listing_id}
