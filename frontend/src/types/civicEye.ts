/**
 * Type definitions for CivicEye AI feature.
 */

import { CivicIssue } from "./index";

export type { CivicIssue };

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
  model_source?: string;
  annotated_image_b64?: string;
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
  isAnonymous?: boolean;
}
