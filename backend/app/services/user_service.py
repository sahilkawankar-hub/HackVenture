"""
User profile business logic service targeting Supabase PostgreSQL.
"""

from typing import Dict, Any, Optional
from datetime import datetime, timezone

from app.utils.supabase_db import get_document, set_document


class UserService:

    @staticmethod
    def get_profile(user_id: str) -> Optional[Dict[str, Any]]:
        return get_document("users", user_id)

    @staticmethod
    def update_profile(user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        existing = get_document("users", user_id) or {}
        existing.update(data)
        existing["id"] = user_id
        existing["updated_at"] = datetime.now(timezone.utc).isoformat()
        return set_document("users", user_id, existing)
