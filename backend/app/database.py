"""
Firebase Admin SDK database & service configuration.

Initializes Firebase App, Firestore database client, and Cloud Storage bucket.
"""

import os
import json
import firebase_admin
from firebase_admin import credentials, firestore, storage
from app.config import settings

_firebase_app = None
_db_client = None
_bucket_client = None


def init_firebase():
    """Initialize Firebase Admin SDK once."""
    global _firebase_app, _db_client, _bucket_client

    if firebase_admin._apps:
        _firebase_app = firebase_admin.get_app()
    else:
        # Priority 1: Service Account JSON file path
        if settings.FIREBASE_CREDENTIALS_PATH and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
        # Priority 2: Individual environment variables
        elif settings.FIREBASE_PROJECT_ID and settings.FIREBASE_PRIVATE_KEY and settings.FIREBASE_CLIENT_EMAIL:
            private_key = settings.FIREBASE_PRIVATE_KEY.replace("\\n", "\n")
            cred_dict = {
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID,
                "private_key": private_key,
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
            }
            cred = credentials.Certificate(cred_dict)
        # Priority 3: Application Default Credentials
        else:
            cred = credentials.ApplicationDefault()

        options = {}
        if settings.FIREBASE_STORAGE_BUCKET:
            options["storageBucket"] = settings.FIREBASE_STORAGE_BUCKET

        _firebase_app = firebase_admin.initialize_app(cred, options)

    _db_client = firestore.client()
    try:
        _bucket_client = storage.bucket() if settings.FIREBASE_STORAGE_BUCKET else None
    except Exception:
        _bucket_client = None

    return _firebase_app


def get_firestore_db():
    """Get Cloud Firestore database client instance."""
    global _db_client
    if _db_client is None:
        init_firebase()
    return _db_client


def get_storage_bucket():
    """Get Firebase Storage bucket instance."""
    global _bucket_client
    if _bucket_client is None:
        init_firebase()
    return _bucket_client


# Convenience exports
db = get_firestore_db()
