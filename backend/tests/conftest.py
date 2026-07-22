"""
Test configuration and shared fixtures.
"""

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest_asyncio.fixture
async def client():
    """Async HTTP test client for FastAPI app."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac


@pytest.fixture
def sample_user_data():
    """Sample user data for tests."""
    return {
        "firebase_uid": "test-firebase-uid-123",
        "email": "testuser@example.com",
        "display_name": "Test User",
        "photo_url": "https://example.com/photo.jpg",
    }
