/**
 * CivicEye AI API client functions.
 */

import apiClient from "../lib/axios";
import { AIDetectionResult, CivicIssue } from "../types/civicEye";

/**
 * Upload an image file to trigger backend YOLO object detection.
 */
export async function detectCivicIssue(imageFile: File): Promise<AIDetectionResult> {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await apiClient.post<AIDetectionResult>("/civic-eye/detect", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * Report a new civic complaint with image file and metadata.
 */
export async function reportCivicIssue(formData: FormData): Promise<CivicIssue> {
  const response = await apiClient.post<CivicIssue>("/civic-eye/report", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * Fetch reported civic issues with optional status, category, and community filters.
 */
export async function getCivicIssues(params?: {
  community_id?: string;
  status?: string;
  category?: string;
}): Promise<CivicIssue[]> {
  const response = await apiClient.get<CivicIssue[]>("/civic-eye/issues", { params });
  return response.data;
}

/**
 * Get details for a single issue.
 */
export async function getCivicIssue(id: string): Promise<CivicIssue> {
  const response = await apiClient.get<CivicIssue>(`/civic-eye/issues/${id}`);
  return response.data;
}

/**
 * Update issue status (open, in_progress, resolved, closed).
 */
export async function updateIssueStatus(
  id: string,
  status: string,
  resolution_notes?: string
): Promise<CivicIssue> {
  const response = await apiClient.put<CivicIssue>(`/civic-eye/issues/${id}/status`, {
    status,
    resolution_notes,
  });
  return response.data;
}

/**
 * Upvote an issue.
 */
export async function upvoteCivicIssue(id: string): Promise<CivicIssue> {
  const response = await apiClient.post<CivicIssue>(`/civic-eye/issues/${id}/upvote`);
  return response.data;
}
