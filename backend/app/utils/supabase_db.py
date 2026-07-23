"""
Supabase PostgreSQL database helper functions.

Provides generic CRUD helper functions (get_document, set_document, query_collection, delete_document)
interacting with Supabase PostgreSQL tables.
"""

from typing import Dict, Any, List, Optional
from app.database import get_supabase_client

# In-memory store fallback for offline/local development without Supabase keys
_in_memory_db: Dict[str, Dict[str, Dict[str, Any]]] = {}


def get_document(table_name: str, doc_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a record from Supabase PostgreSQL table by ID."""
    client = get_supabase_client()
    if client:
        try:
            res = client.table(table_name).select("*").eq("id", doc_id).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
            return None
        except Exception as e:
            print(f"[WARN] Supabase get_document fallback notice: {e}")

    # Fallback to local store
    return _in_memory_db.get(table_name, {}).get(str(doc_id))


def set_document(table_name: str, doc_id: str, data: Dict[str, Any], merge: bool = True) -> Dict[str, Any]:
    """Insert or update (upsert) a record in Supabase PostgreSQL table."""
    data["id"] = str(doc_id)

    client = get_supabase_client()
    if client:
        try:
            res = client.table(table_name).upsert(data).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception as e:
            print(f"[WARN] Supabase set_document fallback notice: {e}")

    # Fallback to local store
    if table_name not in _in_memory_db:
        _in_memory_db[table_name] = {}
    if merge and str(doc_id) in _in_memory_db[table_name]:
        _in_memory_db[table_name][str(doc_id)].update(data)
    else:
        _in_memory_db[table_name][str(doc_id)] = data
    return _in_memory_db[table_name][str(doc_id)]


def query_collection(
    table_name: str,
    filters: Optional[List[tuple]] = None,
    order_by: Optional[str] = None,
    limit: Optional[int] = None,
) -> List[Dict[str, Any]]:
    """
    Query a Supabase PostgreSQL table.

    :param table_name: Table name
    :param filters: List of tuples (field, operator, value), e.g. [("is_deleted", "==", False)]
    :param order_by: Field name to order by
    :param limit: Max number of documents to return
    """
    client = get_supabase_client()
    if client:
        try:
            query = client.table(table_name).select("*")
            if filters:
                for field, op, val in filters:
                    if op in ("==", "="):
                        query = query.eq(field, val)
                    elif op == "!=":
                        query = query.neq(field, val)
                    elif op == ">":
                        query = query.gt(field, val)
                    elif op == "<":
                        query = query.lt(field, val)

            if order_by:
                query = query.order(order_by, desc=True)

            if limit:
                query = query.limit(limit)

            res = query.execute()
            if res.data is not None:
                return res.data
        except Exception as e:
            print(f"[WARN] Supabase query_collection fallback notice: {e}")

    # In-memory query fallback
    table_data = list(_in_memory_db.get(table_name, {}).values())
    if filters:
        for field, op, val in filters:
            if op in ("==", "="):
                table_data = [item for item in table_data if item.get(field) == val]
            elif op == "!=":
                table_data = [item for item in table_data if item.get(field) != val]

    if order_by:
        table_data.sort(key=lambda x: str(x.get(order_by, "")), reverse=True)

    if limit:
        table_data = table_data[:limit]

    return table_data


def delete_document(table_name: str, doc_id: str) -> bool:
    """Delete a record from Supabase PostgreSQL table."""
    client = get_supabase_client()
    if client:
        try:
            client.table(table_name).delete().eq("id", doc_id).execute()
            return True
        except Exception as e:
            print(f"[WARN] Supabase delete_document fallback notice: {e}")

    if table_name in _in_memory_db and str(doc_id) in _in_memory_db[table_name]:
        del _in_memory_db[table_name][str(doc_id)]
    return True
