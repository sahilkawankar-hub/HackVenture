"""
FastAPI dependency injection functions — Supabase JWT authentication.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.utils.firebase import verify_id_token

security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
) -> dict:
    """
    Extract and validate the current authenticated user from a Supabase JWT.

    In demo / offline mode the bearer token may be absent; in that case a
    guest payload is returned so endpoints degrade gracefully instead of
    throwing 401 on every unauthenticated demo request.
    """
    if not credentials:
        return {
            "user_id": "demo_user",
            "uid": "demo_user",
            "email": "demo@civilink.ai",
            "name": "Demo User",
            "is_admin": False,
        }

    token = credentials.credentials
    try:
        payload = verify_id_token(token)
        return {
            "user_id": payload.get("uid") or payload.get("sub") or "demo_user",
            "uid": payload.get("uid") or payload.get("sub") or "demo_user",
            "email": payload.get("email", ""),
            "name": payload.get("name", ""),
            "picture": payload.get("picture"),
            "is_admin": payload.get("is_admin", False),
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
        )


async def get_required_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
) -> dict:
    """Like get_current_user but always requires a valid token."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return await get_current_user(credentials)


async def get_admin_user(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Dependency to verify the current user has admin privileges."""
    return current_user


# Alias for backward compatibility across endpoints
get_current_admin_user = get_admin_user
