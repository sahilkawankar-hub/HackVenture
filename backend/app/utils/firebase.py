"""
Firebase Admin SDK utilities.

Handles Firebase authentication token verification, Firestore CRUD helpers,
and user management operations.
"""

from typing import Dict, Any, List, Optional
from firebase_admin import auth
from app.database import get_firestore_db


def verify_id_token(id_token: str) -> Dict[str, Any]:
    """
    Verify a Firebase ID token sent from the client.
    Returns the decoded token claims dictionary.
    """
    return auth.verify_id_token(id_token)


def get_user_by_uid(uid: str) -> Optional[auth.UserRecord]:
    """Retrieve user record from Firebase Auth by UID."""
    try:
        return auth.get_user(uid)
    except Exception:
        return None


def get_document(collection: str, doc_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a document from Firestore by collection name and document ID."""
    db = get_firestore_db()
    doc_ref = db.collection(collection).document(doc_id)
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        data["id"] = doc.id
        return data
    return None


def set_document(collection: str, doc_id: str, data: Dict[str, Any], merge: bool = True) -> Dict[str, Any]:
    """Create or update a document in Firestore."""
    db = get_firestore_db()
    doc_ref = db.collection(collection).document(doc_id)
    doc_ref.set(data, merge=merge)
    data["id"] = doc_id
    return data


def query_collection(
    collection: str,
    filters: Optional[List[tuple]] = None,
    order_by: Optional[str] = None,
    limit: Optional[int] = None,
) -> List[Dict[str, Any]]:
    """
    Query a Firestore collection.

    :param collection: Collection name
    :param filters: List of tuples (field, operator, value), e.g. [("is_deleted", "==", False)]
    :param order_by: Field name to order by
    :param limit: Max number of documents to return
    """
    db = get_firestore_db()
    query = db.collection(collection)

    if filters:
        for field, op, val in filters:
            query = query.where(field, op, val)

    if order_by:
        query = query.order_by(order_by)

    if limit:
        query = query.limit(limit)

    results = []
    for doc in query.stream():
        data = doc.to_dict()
        data["id"] = doc.id
        results.append(data)
    return results


def delete_document(collection: str, doc_id: str) -> bool:
    """Delete a document from Firestore."""
    db = get_firestore_db()
    db.collection(collection).document(doc_id).delete()
    return True
