"""
Lost & Found API endpoints.
Provides complete CRUD, image upload, AI similarity matching, claiming, and closing items.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException, Query, status

from app.services.lost_found_service import LostFoundService
from app.core.dependencies import get_current_user

router = APIRouter()


@router.get(
    "/items",
    summary="List lost & found items",
    tags=["Lost & Found"],
)
async def list_lost_found_items(
    community_id: Optional[str] = Query(None),
    item_type: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
):
    """List lost and found items with filtering."""
    items = LostFoundService.get_items(
        community_id=community_id,
        item_type=item_type,
        category=category,
        search=search,
        limit=limit,
    )
    return {"items": items, "total": len(items), "page": 1, "page_size": limit, "total_pages": 1}


@router.get(
    "/items/{item_id}",
    summary="Get item details",
    tags=["Lost & Found"],
)
async def get_lost_found_item(item_id: str):
    """Retrieve full details for a lost or found item."""
    item = LostFoundService.get_item(item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item


@router.post(
    "/items",
    summary="Report a lost or found item",
    tags=["Lost & Found"],
)
async def report_lost_found_item(
    item_type: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    category: Optional[str] = Form("Other"),
    location_description: Optional[str] = Form(None),
    community_id: str = Form("community_default"),
    date_lost_found: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user),
):
    """Report a lost or found item with optional image upload."""
    user_id = current_user.get("user_id", "demo_user")
    image_url: Optional[str] = None

    if file:
        contents = await file.read()
        image_url = LostFoundService.upload_item_image(contents)

    doc = LostFoundService.create_item(
        user_id=user_id,
        community_id=community_id,
        item_type=item_type,
        title=title,
        description=description,
        category=category,
        location_description=location_description,
        date_lost_found=date_lost_found,
        latitude=latitude,
        longitude=longitude,
        image_urls=[image_url] if image_url else [],
    )
    return doc


@router.get(
    "/items/{item_id}/matches",
    summary="Get AI similarity matches for item",
    tags=["Lost & Found"],
)
async def get_item_matches(item_id: str):
    """Get AI similarity match suggestions between lost and found items."""
    matches = LostFoundService.find_matches(item_id)
    return matches


@router.post(
    "/items/{item_id}/claim",
    summary="Claim a found item",
    tags=["Lost & Found"],
)
async def claim_lost_found_item(
    item_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Submit a claim for a found item."""
    user_id = current_user.get("user_id", "demo_user")
    updated = LostFoundService.claim_item(item_id, user_id)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return updated


@router.put(
    "/items/{item_id}/close",
    summary="Close lost/found listing",
    tags=["Lost & Found"],
)
async def close_lost_found_item(
    item_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Mark item as resolved/closed."""
    updated = LostFoundService.close_item(item_id)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return updated
