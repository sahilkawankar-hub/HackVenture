"""
CiviLink AI - FastAPI Application Entry Point

AI-powered hyperlocal community platform powered by Supabase PostgreSQL,
Supabase Storage, and Ultralytics YOLO vision models.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_supabase, get_supabase_client
from app.api.v1.router import api_router
from app.core.exceptions import AppException, app_exception_handler
from app.middleware.rate_limiter import RateLimiterMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup and shutdown events."""
    # Startup - Initialize Supabase Client
    try:
        init_supabase()
        print("[OK] Supabase infrastructure initialized successfully.")
    except Exception as e:
        print(f"[WARN] Supabase initialization warning: {e}")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered hyperlocal community platform backed by Supabase",
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Middleware
app.add_middleware(RateLimiterMiddleware)

# API Routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint with Supabase connectivity status."""
    supabase_status = "connected"
    try:
        client = get_supabase_client()
        if not client:
            supabase_status = "offline_mode"
    except Exception:
        supabase_status = "disconnected"

    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database": f"supabase_postgresql ({supabase_status})",
        "storage_bucket": settings.SUPABASE_CIVIC_IMAGES_BUCKET,
    }
