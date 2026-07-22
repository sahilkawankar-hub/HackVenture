"""
Firebase Storage integration.

Handles uploading images, audio files, and documents to Firebase Cloud Storage,
generating public/signed URLs, and file deletions.
"""

import uuid
from typing import Optional
from app.database import get_storage_bucket


def upload_file_bytes(
    file_bytes: bytes,
    destination_path: str,
    content_type: str = "image/jpeg",
) -> Optional[str]:
    """
    Upload raw bytes to Firebase Cloud Storage.

    :param file_bytes: File contents in bytes
    :param destination_path: Storage path (e.g. 'images/civic_eye/issue_123.jpg')
    :param content_type: MIME type of the file
    :return: Public URL or signed download URL
    """
    bucket = get_storage_bucket()
    if not bucket:
        # Fallback for dev environments without storage bucket configured
        return f"https://storage.googleapis.com/demo-bucket/{destination_path}"

    blob = bucket.blob(destination_path)
    blob.upload_from_string(file_bytes, content_type=content_type)
    blob.make_public()
    return blob.public_url


def upload_image(file_bytes: bytes, folder: str = "images") -> Optional[str]:
    """Upload an image file to Firebase Storage."""
    filename = f"{uuid.uuid4()}.jpg"
    path = f"{folder}/{filename}"
    return upload_file_bytes(file_bytes, path, content_type="image/jpeg")


def upload_audio(file_bytes: bytes, folder: str = "audio") -> Optional[str]:
    """Upload an audio file to Firebase Storage."""
    filename = f"{uuid.uuid4()}.mp3"
    path = f"{folder}/{filename}"
    return upload_file_bytes(file_bytes, path, content_type="audio/mpeg")


def delete_file(storage_path: str) -> bool:
    """Delete a file from Firebase Storage."""
    bucket = get_storage_bucket()
    if not bucket:
        return False
    try:
        blob = bucket.blob(storage_path)
        blob.delete()
        return True
    except Exception:
        return False
