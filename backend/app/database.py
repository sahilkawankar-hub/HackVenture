"""
Supabase database & client configuration.

Initializes the Supabase client for PostgreSQL database operations and Cloud Storage buckets.
"""

from typing import Optional
from app.config import settings

_supabase_client = None


def init_supabase():
    """Initialize Supabase Client once."""
    global _supabase_client

    if _supabase_client is not None:
        return _supabase_client

    try:
        from supabase import create_client, Client
        api_key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY
        if settings.SUPABASE_URL and api_key:
            _supabase_client = create_client(settings.SUPABASE_URL, api_key)
            print(f"[OK] Supabase client connected to {settings.SUPABASE_URL}")
        else:
            print("[WARN] Supabase credentials not found in env, running in mock/offline mode.")
            _supabase_client = None
    except Exception as e:
        print(f"[WARN] Supabase initialization warning: {e}")
        _supabase_client = None

    return _supabase_client


def get_supabase_client():
    """Get initialized Supabase Client instance."""
    global _supabase_client
    if _supabase_client is None:
        init_supabase()
    return _supabase_client
