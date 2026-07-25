/**
 * Shared TypeScript type definitions for CiviLink AI.
 */

// ── User ────────────────────────────────────────
export interface User {
  id: string;
  supabase_uid: string;
  email: string;
  display_name: string;
  photo_url: string | null;
  phone: string | null;
  bio: string | null;
  neighborhood: string | null;
  is_admin: boolean;
  is_active: boolean;
  reputation_score: number;
  created_at: string;
}

export interface UserProfile extends User {
  total_reports: number;
  total_posts: number;
  communities_joined: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned_at: string;
}

// ── Community ───────────────────────────────────
export interface Community {
  id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  logo_url: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  community_type: "apartment_society" | "neighborhood" | "interest_based" | "other";
  join_policy: "public" | "approval_required" | "invite_only";
  rules: string | null;
  tags: string[];
  max_members: number | null;
  member_count: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: CommunityRole;
  status: "active" | "pending" | "removed";
  joined_at: string;
  user?: Partial<User>;
}

export type CommunityRole = "owner" | "admin" | "moderator" | "member";

export interface JoinRequest {
  id: string;
  community_id: string;
  user_id: string;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  user?: Partial<User>;
}

// ── Notification ────────────────────────────────
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
  metadata: Record<string, unknown>;
}

export type NotificationType =
  | "complaint_update"
  | "community_approval"
  | "marketplace_message"
  | "lost_found_match"
  | "job_update"
  | "announcement"
  | "like"
  | "comment"
  | "join_request"
  | "system";

// ── Post ────────────────────────────────────────
export interface Post {
  id: string;
  author_id: string;
  community_id: string;
  content: string;
  title: string | null;
  media_urls: string[] | null;
  category: "Announcement" | "Discussion" | "Question" | "Event" | null;
  hashtags: string[];
  like_count: number;
  comment_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  author?: Partial<User>;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Partial<User>;
}

// ── Civic Issue ─────────────────────────────────
export interface BoundingBox {
  box: number[];
  label: string;
  confidence: number;
}

export interface AIDetectionResult {
  detected_issue: string;
  confidence_score: number;
  suggested_category: string;
  priority: "low" | "medium" | "high" | "critical";
  labels: string[];
  bounding_boxes?: BoundingBox[];
  model_source?: string;
  annotated_image_b64?: string;
}

export interface CivicIssue {
  id: string;
  reporter_id: string;
  community_id: string;
  title: string;
  description: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "ai_processing" | "pending_review" | "assigned" | "in_progress" | "resolved" | "closed";
  image_urls: string[] | null;
  ai_detected_labels: string[] | null;
  ai_confidence: number | null;
  ai_bounding_boxes: unknown[] | null;
  model_source: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  upvote_count: number;
  is_anonymous: boolean;
  assigned_department: string | null;
  resolution_notes: string | null;
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
  image_url?: string | null;
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
  is_wishlisted?: boolean;
  created_at: string;
  updated_at: string;
  seller?: Partial<User>;
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
  is_saved?: boolean;
  created_at: string;
  expires_at: string | null;
  poster?: Partial<User>;
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
