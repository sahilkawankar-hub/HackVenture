-- ==========================================================
-- CiviLink AI - Supabase PostgreSQL Database Schema DDL
-- ==========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    photo_url TEXT,
    phone TEXT,
    bio TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Civic Issues Table (Stores CivicEye AI Complaints & Detections)
CREATE TABLE IF NOT EXISTS public.civic_issues (
    id TEXT PRIMARY KEY,
    reporter_id TEXT NOT NULL,
    community_id TEXT NOT NULL DEFAULT 'community_default',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'medium', -- low | medium | high | critical
    status TEXT NOT NULL DEFAULT 'open',     -- open | in_progress | resolved | closed
    image_urls TEXT[],
    ai_detected_labels TEXT[],
    ai_confidence DOUBLE PRECISION,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address TEXT,
    upvote_count INT DEFAULT 0,
    assigned_to TEXT,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Community Feed Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    community_id TEXT NOT NULL,
    content TEXT NOT NULL,
    media_urls TEXT[],
    category TEXT,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Lost & Found Table
CREATE TABLE IF NOT EXISTS public.lost_found_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    community_id TEXT NOT NULL,
    item_type TEXT NOT NULL, -- lost | found
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    image_urls TEXT[],
    location_description TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status TEXT DEFAULT 'active',
    date_lost_found TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Marketplace Listings Table
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL,
    community_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    image_urls TEXT[],
    status TEXT DEFAULT 'active',
    views_count INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Job Postings Table
CREATE TABLE IF NOT EXISTS public.job_postings (
    id TEXT PRIMARY KEY,
    poster_id TEXT NOT NULL,
    community_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    job_type TEXT NOT NULL,
    category TEXT NOT NULL,
    pay_range TEXT,
    location TEXT,
    requirements TEXT[],
    status TEXT DEFAULT 'open',
    application_count INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- 7. Supabase Storage Bucket Setup for Complaint Photos ('civic-images')
INSERT INTO storage.buckets (id, name, public)
VALUES ('civic-images', 'civic-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Storage Security Policies (Public Access)
CREATE POLICY "Public Read Access for Civic Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'civic-images');

CREATE POLICY "Public Upload Access for Civic Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'civic-images');
