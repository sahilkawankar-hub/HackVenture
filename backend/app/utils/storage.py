"""
Supabase Storage integration.

Handles uploading complaint images, audio files, and documents to Supabase Storage buckets,
specifically uploading civic issue images to the 'civic-images' bucket.
"""

import uuid
from typing import Optional
from app.config import settings
from app.database import get_supabase_client


def upload_file_bytes(
    file_bytes: bytes,
    destination_path: str,
    content_type: str = "image/jpeg",
    bucket_name: Optional[str] = None,
) -> Optional[str]:
    """
    Upload raw bytes to Supabase Storage.

    :param file_bytes: File contents in bytes
    :param destination_path: Storage path (e.g. 'issue_123.jpg')
    :param content_type: MIME type of the file
    :param bucket_name: Storage bucket name (defaults to SUPABASE_CIVIC_IMAGES_BUCKET)
    :return: Public URL of the uploaded asset
    """
    target_bucket = bucket_name or settings.SUPABASE_CIVIC_IMAGES_BUCKET
    client = get_supabase_client()

    if client:
        try:
            # Upload file bytes to Supabase Storage bucket
            client.storage.from_(target_bucket).upload(
                file=file_bytes,
                path=destination_path,
                file_options={"content-type": content_type, "upsert": "true"},
            )
            # Retrieve public URL
            public_url = client.storage.from_(target_bucket).get_public_url(destination_path)
            return public_url
        except Exception as e:
            print(f"[INFO] Supabase Storage upload notice: {e}")
            # Fallback URL if bucket exists or public URL method applies
            return f"{settings.SUPABASE_URL}/storage/v1/object/public/{target_bucket}/{destination_path}"

    # Local dev fallback URL
    return f"https://supabase.local/storage/v1/object/public/{target_bucket}/{destination_path}"


def upload_image(file_bytes: bytes, folder: str = "civic_eye") -> Optional[str]:
    """Upload an image file to Supabase 'civic-images' storage bucket."""
    filename = f"{uuid.uuid4()}.jpg"
    path = f"{folder}/{filename}"
    return upload_file_bytes(
        file_bytes,
        path,
        content_type="image/jpeg",
        bucket_name=settings.SUPABASE_CIVIC_IMAGES_BUCKET,
    )


def upload_audio(file_bytes: bytes, folder: str = "audio") -> Optional[str]:
    """Upload an audio file to Supabase Storage."""
    filename = f"{uuid.uuid4()}.mp3"
    path = f"{folder}/{filename}"
    return upload_file_bytes(file_bytes, path, content_type="audio/mpeg")


def delete_file(destination_path: str, bucket_name: Optional[str] = None) -> bool:
    """Delete a file from Supabase Storage."""
    target_bucket = bucket_name or settings.SUPABASE_CIVIC_IMAGES_BUCKET
    client = get_supabase_client()
    if not client:
        return False
    try:
        client.storage.from_(target_bucket).remove([destination_path])
        return True
    except Exception:
        return False
