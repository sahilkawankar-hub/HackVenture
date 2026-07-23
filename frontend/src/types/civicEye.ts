/**
 * Type definitions for CivicEye AI feature.
 */

export interface BoundingBox {
  box: number[];
  label: string;
  confidence: number;
}

export interface AIDetectionResult {
  detected_issue: string;
  confidence_score: number; // e.g. 0.94 -> 94%
  suggested_category: string;
  priority: "low" | "medium" | "high" | "critical";
  labels: string[];
  bounding_boxes?: BoundingBox[];
}

export interface CivicIssue {
  id: string;
  reporter_id: string;
  community_id: string;
  title: string;
  description: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  image_urls?: string[] | null;
  ai_detected_labels?: string[] | null;
  ai_confidence?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  upvote_count: number;
  created_at: string;
  resolved_at?: string | null;
  resolution_notes?: string | null;
}

export interface CivicIssueFormData {
  title: string;
  description: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  imageFile?: File | null;
  aiDetectedLabels?: string[];
  aiConfidence?: number | null;
}
