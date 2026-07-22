"""
Database initialization script for Cloud Firestore.

Usage:
    python -m app.db.init_db          # Verify Firestore connectivity
    python -m app.db.init_db --seed   # Verify + seed Firestore collections
"""

import sys
import asyncio
from app.database import init_firebase, get_firestore_db


def verify_connection() -> bool:
    """Verify Firestore connectivity."""
    try:
        init_firebase()
        db = get_firestore_db()
        if db:
            print("✅ Firebase Cloud Firestore connection verified.")
            return True
    except Exception as e:
        print(f"❌ Firestore connection failed: {e}")
        return False
    return False


async def init_db(seed: bool = False) -> None:
    """Run Firestore initialization and optional seed."""
    print("=" * 60)
    print("  CiviLink AI — Firebase Firestore Initialization")
    print("=" * 60)
    print()

    if not verify_connection():
        print("\n❌ Cannot proceed without a valid Firebase configuration.")
        sys.exit(1)

    if seed:
        print()
        from app.db.seed import seed_firestore
        await seed_firestore()

    print()
    print("=" * 60)
    print("  ✅ Firestore initialization complete!")
    print("=" * 60)


if __name__ == "__main__":
    seed_flag = "--seed" in sys.argv
    asyncio.run(init_db(seed=seed_flag))
