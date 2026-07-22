"""
CivicEye AI endpoints.

AI-powered civic issue reporting, detection, and tracking.
"""

from fastapi import APIRouter

router = APIRouter()


# TODO: POST   /report     - Report a civic issue (with image)
# TODO: GET    /issues     - List reported issues (paginated, filtered)
# TODO: GET    /issues/{id} - Get issue details
# TODO: PUT    /issues/{id} - Update issue status
# TODO: POST   /detect     - AI image analysis for issue detection
# TODO: GET    /heatmap    - Get issue density heatmap data
