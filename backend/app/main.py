"""
CiviLink AI - FastAPI Application Entry Point

AI-powered hyperlocal community platform backed by Supabase PostgreSQL,
Supabase Storage, and a HuggingFace Road Damage YOLO vision model.
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
    # ── Startup ──────────────────────────────────────────────────────────────
    # 1. Supabase client
    try:
        init_supabase()
        print("[OK] Supabase infrastructure initialized successfully.")
    except Exception as exc:
        print(f"[WARN] Supabase initialization warning: {exc}")

    # 2. Leave the AI model unloaded until first use so startup and tests stay
    #    lightweight.
    try:
        from app.ai.civic_eye_model import get_civic_eye_status

        status = get_civic_eye_status()
        print(f"[INFO] CivicEye AI status: {status['model_source']}")
    except Exception as exc:
        print(f"[WARN] CivicEye AI status check failed: {exc}")

    yield
    # ── Shutdown ──────────────────────────────────────────────────────────────
    print("[INFO] CiviLink AI shutting down.")


app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "AI-powered hyperlocal community platform backed by Supabase. "
        "Road damage and civic issue detection powered by "
        "nsr51324/Road_Damage_Object_Detection (HuggingFace YOLOv8)."
    ),
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
    """Health check endpoint with Supabase connectivity and AI model status."""
    # Supabase status
    supabase_status = "connected"
    try:
        client = get_supabase_client()
        if not client:
            supabase_status = "offline_mode"
    except Exception:
        supabase_status = "disconnected"

    # AI model status
    try:
        from app.ai.civic_eye_model import get_civic_eye_status

        ai_status = get_civic_eye_status()
    except Exception:
        ai_status = {"is_ready": False, "model_source": "unavailable"}

    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database": f"supabase_postgresql ({supabase_status})",
        "storage_bucket": settings.SUPABASE_CIVIC_IMAGES_BUCKET,
        "ai_model": {
            "is_ready": ai_status.get("is_ready", False),
            "model_source": ai_status.get("model_source", "unknown"),
        },
    }
