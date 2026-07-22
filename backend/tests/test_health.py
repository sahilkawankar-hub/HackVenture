"""
Health check endpoint tests.
"""

import pytest


@pytest.mark.asyncio
async def test_health_check(client):
    """Test that the health check endpoint returns 200."""
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
