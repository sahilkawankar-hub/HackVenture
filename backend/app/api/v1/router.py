"""
API v1 Router - Aggregates all endpoint routers.
Each feature module registers its own router here.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    feed,
    civic_eye,
    lost_found,
    marketplace,
    jobs,
    admin,
    community,
    notifications,
    users,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(feed.router, prefix="/feed", tags=["Community Feed"])
api_router.include_router(civic_eye.router, prefix="/civic-eye", tags=["CivicEye AI"])
api_router.include_router(lost_found.router, prefix="/lost-found", tags=["Lost & Found"])
api_router.include_router(marketplace.router, prefix="/marketplace", tags=["Marketplace"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["Local Jobs"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin Dashboard"])
api_router.include_router(community.router, prefix="/community", tags=["Community Management"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(users.router, prefix="/users", tags=["Users & Profiles"])
