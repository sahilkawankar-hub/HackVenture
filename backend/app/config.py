"""
Application configuration using Pydantic Settings.

All environment variables are loaded from .env and validated here.
"""

from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────
    APP_NAME: str = "CiviLink AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    # ── Server ───────────────────────────────────────────
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # ── CORS ─────────────────────────────────────────────
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # ── Supabase Infrastructure ──────────────────────────
    SUPABASE_URL: str = "https://xyzcompany.supabase.co"
    SUPABASE_KEY: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key"
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_JWT_SECRET: str = "your-supabase-jwt-secret"
    SUPABASE_CIVIC_IMAGES_BUCKET: str = "civic-images"

    # ── Google Maps ──────────────────────────────────────
    GOOGLE_MAPS_API_KEY: str = ""

    # ── Hugging Face ─────────────────────────────────────
    HUGGINGFACE_API_TOKEN: str = ""

    # ── Security ─────────────────────────────────────────
    SECRET_KEY: str = "change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # ── Rate Limiting ────────────────────────────────────
    RATE_LIMIT_PER_MINUTE: int = 60


settings = Settings()
