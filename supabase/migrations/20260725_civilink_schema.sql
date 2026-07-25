-- =============================================================================
-- CiviLink AI — Complete Supabase PostgreSQL Schema Migration
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. Users Table ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supabase_uid TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    photo_url TEXT,
    phone TEXT,
    bio TEXT,
    neighborhood TEXT DEFAULT 'Greenwood Heights',
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    reputation_score INT DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Communities Table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.communities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    logo_url TEXT,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    community_type TEXT DEFAULT 'neighborhood', -- neighborhood, apartment_society, interest_based, other
    join_policy TEXT DEFAULT 'public',           -- public, approval_required, invite_only
    rules TEXT,
    tags TEXT[],
    max_members INT DEFAULT 500,
    member_count INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_by TEXT REFERENCES public.users(supabase_uid) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. Community Members Table ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.community_members (
    id TEXT PRIMARY KEY,
    community_id TEXT REFERENCES public.communities(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    role TEXT DEFAULT 'member', -- owner, admin, moderator, member
    status TEXT DEFAULT 'active', -- active, pending, removed
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(community_id, user_id)
);

-- ── 4. Join Requests Table ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.join_requests (
    id TEXT PRIMARY KEY,
    community_id TEXT REFERENCES public.communities(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. Civic Issues (CivicEye AI) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.civic_issues (
    id TEXT PRIMARY KEY,
    reporter_id TEXT NOT NULL,
    community_id TEXT DEFAULT 'community_default',
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    severity TEXT DEFAULT 'medium', -- low, medium, high, critical
    status TEXT DEFAULT 'open',     -- open, ai_processing, pending_review, assigned, in_progress, resolved, closed
    image_urls TEXT[],
    ai_detected_labels TEXT[],
    ai_confidence DOUBLE PRECISION,
    ai_bounding_boxes JSONB,
    model_source TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address TEXT,
    upvote_count INT DEFAULT 0,
    is_anonymous BOOLEAN DEFAULT FALSE,
    assigned_department TEXT,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- ── 6. Feed Posts Table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    community_id TEXT DEFAULT 'community_default',
    title TEXT,
    content TEXT NOT NULL,
    media_urls TEXT[],
    category TEXT DEFAULT 'Discussion', -- Announcement, Discussion, Question, Event
    hashtags TEXT[],
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 7. Post Comments Table ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
    id TEXT PRIMARY KEY,
    post_id TEXT REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 8. Lost & Found Items Table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lost_found_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    community_id TEXT DEFAULT 'community_default',
    item_type TEXT NOT NULL, -- lost, found
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    image_urls TEXT[],
    location_description TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status TEXT DEFAULT 'active', -- active, matched, claimed, closed
    date_lost_found TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 9. Marketplace Listings Table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL,
    community_id TEXT DEFAULT 'community_default',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    category TEXT NOT NULL,
    condition TEXT DEFAULT 'good', -- new, like_new, good, fair
    image_urls TEXT[],
    status TEXT DEFAULT 'active', -- active, sold, reserved, removed
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 10. Job Postings Table ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.job_postings (
    id TEXT PRIMARY KEY,
    poster_id TEXT NOT NULL,
    community_id TEXT DEFAULT 'community_default',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    job_type TEXT DEFAULT 'one_time', -- full_time, part_time, freelance, one_time
    category TEXT NOT NULL,
    pay_range TEXT,
    location TEXT,
    requirements TEXT[],
    status TEXT DEFAULT 'open', -- open, filled, closed
    application_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- ── 11. Notifications Table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ── Indexes for Performance ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_civic_issues_status ON public.civic_issues(status);
CREATE INDEX IF NOT EXISTS idx_civic_issues_category ON public.civic_issues(category);
CREATE INDEX IF NOT EXISTS idx_posts_community ON public.posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_lost_found_type ON public.lost_found_items(item_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_category ON public.marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.job_postings(category);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);
