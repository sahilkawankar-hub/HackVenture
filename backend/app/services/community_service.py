"""
Community business logic service targeting Supabase PostgreSQL.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import uuid

from app.utils.supabase_db import get_document, set_document, query_collection, delete_document
from app.utils.storage import upload_image


class CommunityService:

    @staticmethod
    def get_communities(
        search: Optional[str] = None,
        community_type: Optional[str] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        filters = []
        if community_type:
            filters.append(("community_type", "==", community_type))

        items = query_collection("communities", filters=filters, limit=limit)
        if search:
            s = search.lower()
            items = [
                item for item in items
                if s in item.get("name", "").lower() or s in item.get("description", "").lower()
            ]
        return items

    @staticmethod
    def get_community(community_id: str) -> Optional[Dict[str, Any]]:
        return get_document("communities", community_id)

    @staticmethod
    def upload_image(file_bytes: bytes, folder: str = "community") -> Optional[str]:
        return upload_image(file_bytes, folder=folder)

    @staticmethod
    def create_community(
        creator_id: str,
        name: str,
        description: Optional[str] = None,
        community_type: str = "neighborhood",
        join_policy: str = "public",
        address: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        rules: Optional[str] = None,
        tags: Optional[List[str]] = None,
        max_members: Optional[int] = 500,
        cover_image_url: Optional[str] = None,
        logo_url: Optional[str] = None,
    ) -> Dict[str, Any]:
        comm_id = f"c_{uuid.uuid4().hex[:8]}"
        now = datetime.now(timezone.utc).isoformat()

        doc = {
            "id": comm_id,
            "name": name,
            "description": description,
            "cover_image_url": cover_image_url,
            "logo_url": logo_url,
            "address": address,
            "latitude": latitude,
            "longitude": longitude,
            "community_type": community_type,
            "join_policy": join_policy,
            "rules": rules,
            "tags": tags or [],
            "max_members": max_members,
            "member_count": 1,
            "is_active": True,
            "created_by": creator_id,
            "created_at": now,
        }
        set_document("communities", comm_id, doc)

        # Assign creator as Owner
        member_doc = {
            "id": f"m_{uuid.uuid4().hex[:8]}",
            "community_id": comm_id,
            "user_id": creator_id,
            "role": "owner",
            "status": "active",
            "joined_at": now,
        }
        set_document("community_members", member_doc["id"], member_doc)

        return doc

    @staticmethod
    def join_community(
        community_id: str,
        user_id: str,
        message: Optional[str] = None,
    ) -> Dict[str, Any]:
        comm = get_document("communities", community_id)
        now = datetime.now(timezone.utc).isoformat()

        if comm and comm.get("join_policy") == "approval_required":
            req_id = f"req_{uuid.uuid4().hex[:8]}"
            req_doc = {
                "id": req_id,
                "community_id": community_id,
                "user_id": user_id,
                "message": message,
                "status": "pending",
                "created_at": now,
            }
            set_document("join_requests", req_id, req_doc)
            return {"status": "pending", "request_id": req_id, "message": "Join request submitted"}

        member_id = f"m_{uuid.uuid4().hex[:8]}"
        member_doc = {
            "id": member_id,
            "community_id": community_id,
            "user_id": user_id,
            "role": "member",
            "status": "active",
            "joined_at": now,
        }
        set_document("community_members", member_id, member_doc)

        # Increment count
        if comm:
            comm["member_count"] = comm.get("member_count", 0) + 1
            set_document("communities", community_id, comm)

        return {"status": "active", "member_id": member_id, "message": "Joined community successfully"}

    @staticmethod
    def leave_community(community_id: str, user_id: str) -> bool:
        members = query_collection(
            "community_members",
            filters=[("community_id", "==", community_id), ("user_id", "==", user_id)],
        )
        for m in members:
            delete_document("community_members", m["id"])
        return True

    @staticmethod
    def get_members(community_id: str) -> List[Dict[str, Any]]:
        return query_collection("community_members", filters=[("community_id", "==", community_id)])

    @staticmethod
    def get_join_requests(community_id: str) -> List[Dict[str, Any]]:
        return query_collection(
            "join_requests",
            filters=[("community_id", "==", community_id), ("status", "==", "pending")],
        )

    @staticmethod
    def approve_join_request(community_id: str, request_id: str) -> Dict[str, Any]:
        req = get_document("join_requests", request_id)
        if req:
            req["status"] = "approved"
            set_document("join_requests", request_id, req)

            # Create member
            now = datetime.now(timezone.utc).isoformat()
            member_id = f"m_{uuid.uuid4().hex[:8]}"
            member_doc = {
                "id": member_id,
                "community_id": community_id,
                "user_id": req.get("user_id"),
                "role": "member",
                "status": "active",
                "joined_at": now,
            }
            set_document("community_members", member_id, member_doc)
            return req
        return {}

    @staticmethod
    def reject_join_request(community_id: str, request_id: str) -> Dict[str, Any]:
        req = get_document("join_requests", request_id)
        if req:
            req["status"] = "rejected"
            set_document("join_requests", request_id, req)
            return req
        return {}

    @staticmethod
    def get_user_communities(user_id: str) -> List[Dict[str, Any]]:
        memberships = query_collection("community_members", filters=[("user_id", "==", user_id)])
        comm_ids = [m["community_id"] for m in memberships if "community_id" in m]
        communities = []
        for cid in comm_ids:
            c = get_document("communities", cid)
            if c:
                communities.append(c)
        return communities
