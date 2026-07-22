"""
Database seed script for Firebase Cloud Firestore.

Populates Firestore collections with realistic sample data.
Usage:
    python -m app.db.seed
"""

import asyncio
from datetime import datetime, timedelta, timezone
from app.utils.firebase import set_document, query_collection
from app.models import Collections
from app.models.user import create_user_doc
from app.models.community import create_community_doc, create_community_member_doc
from app.models.post import create_post_doc, create_comment_doc
from app.models.civic_issue import create_civic_issue_doc
from app.models.lost_found_item import create_lost_found_doc
from app.models.marketplace_listing import create_marketplace_doc
from app.models.job_posting import create_job_posting_doc, create_job_application_doc
from app.models.notification import create_notification_doc


async def seed_firestore() -> None:
    """Seed Firestore collections with initial test data."""
    existing = query_collection(Collections.USERS, limit=1)
    if existing:
        print("⚠️ Firestore 'users' collection already contains data. Skipping seed.")
        return

    print("🌱 Seeding Firebase Cloud Firestore collections with test data...")

    # 1. Users
    u1 = create_user_doc("uid-admin-001", "admin@civilink.dev", "Aarav Sharma", is_admin=True)
    u2 = create_user_doc("uid-user-002", "priya@civilink.dev", "Priya Patel")
    u3 = create_user_doc("uid-user-003", "rahul@civilink.dev", "Rahul Kumar")
    for u in [u1, u2, u3]:
        set_document(Collections.USERS, u["id"], u)
    print("   ✅ 3 users created")

    # 2. Communities
    c1 = create_community_doc("Greenview Apartments", u1["id"], city="Bangalore", community_type="apartment")
    c2 = create_community_doc("IIT Campus Hub", u1["id"], city="Mumbai", community_type="campus")
    for c in [c1, c2]:
        set_document(Collections.COMMUNITIES, c["id"], c)
    print("   ✅ 2 communities created")

    # 3. Posts
    p1 = create_post_doc(u1["id"], c1["id"], "🎉 Welcome to Greenview Apartments on CiviLink AI!", category="announcement", is_pinned=True)
    p2 = create_post_doc(u2["id"], c1["id"], "Does anyone know a good plumber?", category="help")
    for p in [p1, p2]:
        set_document(Collections.POSTS, p["id"], p)
    print("   ✅ 2 feed posts created")

    # 4. Civic Issues
    ci1 = create_civic_issue_doc(u2["id"], c1["id"], "Large pothole near Block C entrance", "Dangerous pothole 2ft wide.", "pothole", severity="high")
    set_document(Collections.CIVIC_ISSUES, ci1["id"], ci1)
    print("   ✅ 1 civic issue created")

    # 5. Lost & Found
    lf1 = create_lost_found_doc(u2["id"], c1["id"], "lost", "Black Leather Wallet", "Lost Tommy Hilfiger wallet near pool area.", category="personal")
    set_document(Collections.LOST_FOUND, lf1["id"], lf1)
    print("   ✅ 1 lost & found item created")

    # 6. Marketplace
    m1 = create_marketplace_doc(u3["id"], c1["id"], "Samsung 32-inch Smart TV", "In excellent condition.", 8500.0, category="Electronics")
    set_document(Collections.MARKETPLACE, m1["id"], m1)
    print("   ✅ 1 marketplace listing created")

    # 7. Jobs
    j1 = create_job_posting_doc(u1["id"], c1["id"], "Part-time Security Guard", "Night shifts (10 PM - 6 AM).", "part_time", "Security", pay_range="₹12,000/month")
    set_document(Collections.JOBS, j1["id"], j1)
    print("   ✅ 1 job posting created")

    # 8. Notifications
    n1 = create_notification_doc(u2["id"], "welcome", "Welcome to CiviLink AI!", "You've joined Greenview Apartments.")
    set_document(Collections.NOTIFICATIONS, n1["id"], n1)
    print("   ✅ 1 notification created")

    print("\n🎉 Firebase Cloud Firestore seeding complete!")


if __name__ == "__main__":
    asyncio.run(seed_firestore())
