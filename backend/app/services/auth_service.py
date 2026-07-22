"""
Authentication service.

Handles Firebase Google Auth token verification, user account sync,
and profile management in Firestore.
"""

from typing import Dict, Any, Optional
from firebase_admin import auth
from app.utils.firebase import verify_id_token, get_document, set_document
from app.models.user import create_user_doc
from app.models import Collections


class AuthService:
    @staticmethod
    def verify_and_sync_user(firebase_token: str) -> Dict[str, Any]:
        """
        Verify Firebase ID token and retrieve/create user profile in Firestore.
        """
        decoded_token = verify_id_token(firebase_token)
        uid = decoded_token.get("uid")
        email = decoded_token.get("email", "")
        display_name = decoded_token.get("name", email.split("@")[0])
        photo_url = decoded_token.get("picture")

        # Check if user document exists in Firestore
        existing_user = get_document(Collections.USERS, uid)
        if existing_user:
            return existing_user

        # Create new user document in Firestore 'users' collection
        user_data = create_user_doc(
            uid=uid,
            email=email,
            display_name=display_name,
            photo_url=photo_url,
        )
        set_document(Collections.USERS, uid, user_data)
        return user_data

    @staticmethod
    def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
        """Fetch user profile from Firestore."""
        return get_document(Collections.USERS, user_id)

    @staticmethod
    def update_user_profile(user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user profile in Firestore."""
        user = get_document(Collections.USERS, user_id)
        if not user:
            return None
        user.update(updates)
        return set_document(Collections.USERS, user_id, user, merge=True)
