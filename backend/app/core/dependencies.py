"""
FastAPI dependency injection functions.

Shared dependencies used across API endpoints.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth

from app.database import get_firestore_db
from app.core.security import decode_access_token

security_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
) -> dict:
    """
    Dependency to extract and validate the current authenticated user.

    Supports both Firebase ID Tokens and custom JWT access tokens.
    """
    token = credentials.credentials
    user_payload = None

    # First attempt: Verify as Firebase ID token
    try:
        decoded_token = auth.verify_id_token(token)
        user_payload = {
            "user_id": decoded_token.get("uid"),
            "firebase_uid": decoded_token.get("uid"),
            "email": decoded_token.get("email"),
            "display_name": decoded_token.get("name"),
            "photo_url": decoded_token.get("picture"),
        }
    except Exception:
        # Second attempt: Decode custom app JWT token
        try:
            payload = decode_access_token(token)
            user_id = payload.get("sub")
            if user_id:
                user_payload = {"user_id": user_id, **payload}
        except Exception:
            pass

    if not user_payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
        )

    # Fetch fresh user data from Firestore if available
    try:
        db = get_firestore_db()
        user_doc = db.collection("users").document(user_payload["firebase_uid"]).get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            user_payload.update(user_data)
    except Exception:
        pass

    return user_payload


async def get_admin_user(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Dependency to verify the current user has admin privileges."""
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
