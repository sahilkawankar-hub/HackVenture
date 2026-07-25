"""
Notifications business logic service targeting Supabase PostgreSQL.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import uuid

from app.utils.supabase_db import get_document, set_document, query_collection, delete_document


class NotificationService:

    @staticmethod
    def get_notifications(
        user_id: str,
        is_read: Optional[bool] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        filters = [("user_id", "==", user_id)]
        if is_read is not None:
            filters.append(("is_read", "==", is_read))
        return query_collection("notifications", filters=filters, limit=limit)

    @staticmethod
    def get_unread_count(user_id: str) -> int:
        notifs = query_collection(
            "notifications",
            filters=[("user_id", "==", user_id), ("is_read", "==", False)],
        )
        return len(notifs)

    @staticmethod
    def mark_read(notification_id: str) -> Optional[Dict[str, Any]]:
        notif = get_document("notifications", notification_id)
        if notif:
            notif["is_read"] = True
            set_document("notifications", notification_id, notif)
            return notif
        return None

    @staticmethod
    def mark_all_read(user_id: str) -> bool:
        unread = query_collection(
            "notifications",
            filters=[("user_id", "==", user_id), ("is_read", "==", False)],
        )
        for n in unread:
            n["is_read"] = True
            set_document("notifications", n["id"], n)
        return True

    @staticmethod
    def delete(notification_id: str) -> bool:
        return delete_document("notifications", notification_id)

    @staticmethod
    def create_notification(
        user_id: str,
        notif_type: str,
        title: str,
        body: str,
        link: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        nid = f"n_{uuid.uuid4().hex[:8]}"
        now = datetime.now(timezone.utc).isoformat()
        doc = {
            "id": nid,
            "user_id": user_id,
            "type": notif_type,
            "title": title,
            "body": body,
            "link": link,
            "is_read": False,
            "created_at": now,
            "metadata": metadata or {},
        }
        set_document("notifications", nid, doc)
        return doc
