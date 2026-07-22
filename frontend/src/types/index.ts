/**
 * Shared TypeScript type definitions.
 */

// ── User ────────────────────────────────────────
export interface User {
  id: string;
  firebase_uid: string;
  email: string;
  display_name: string;
  photo_url: string | null;
  phone: string | null;
  bio: string | null;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

// ── Community ───────────────────────────────────
export interface Community {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

// ── Post ────────────────────────────────────────
export interface Post {
  id: string;
  author_id: string;
  community_id: string;
  content: string;
  media_urls: string[] | null;
  category: string | null;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
}

// ── Civic Issue ─────────────────────────────────
export interface CivicIssue {
  id: string;
  reporter_id: string;
  community_id: string;
  title: string;
  description: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  image_urls: string[] | null;
  ai_detected_labels: string[] | null;
  ai_confidence: number | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  upvote_count: number;
  created_at: string;
  resolved_at: string | null;
}

// ── Lost & Found ────────────────────────────────
export interface LostFoundItem {
  id: string;
  user_id: string;
  community_id: string;
  item_type: "lost" | "found";
  title: string;
  description: string;
  category: string | null;
  image_urls: string[] | null;
  location_description: string | null;
  latitude: number | null;
  longitude: number | null;
  status: "active" | "matched" | "claimed" | "closed";
  date_lost_found: string | null;
  created_at: string;
}

export interface MatchSuggestion {
  item_id: string;
  title: string;
  similarity_score: number;
  matched_item_type: "lost" | "found";
}

// ── Marketplace ─────────────────────────────────
export interface MarketplaceListing {
  id: string;
  seller_id: string;
  community_id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  condition: "new" | "like_new" | "good" | "fair";
  image_urls: string[] | null;
  status: "active" | "sold" | "reserved" | "removed";
  views_count: number;
  created_at: string;
  updated_at: string;
}

// ── Jobs ────────────────────────────────────────
export interface JobPosting {
  id: string;
  poster_id: string;
  community_id: string;
  title: string;
  description: string;
  job_type: "full_time" | "part_time" | "freelance" | "one_time";
  category: string;
  pay_range: string | null;
  location: string | null;
  requirements: string[] | null;
  status: "open" | "filled" | "closed";
  application_count: number;
  created_at: string;
  expires_at: string | null;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_note: string | null;
  status: "pending" | "accepted" | "rejected";
  applied_at: string;
}

// ── API Response ────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiError {
  error: boolean;
  message: string;
  detail: string | null;
}
