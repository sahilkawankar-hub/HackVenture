/**
 * Admin API client.
 */
import apiClient from "../lib/axios";

export interface AdminStats {
  today_reports: number;
  open_reports: number;
  resolved_reports: number;
  critical_issues: number;
  monthly_reports: number;
  resolution_rate: number;
  avg_resolution_hours: number;
  active_users: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const response = await apiClient.get<AdminStats>("/admin/stats");
  return response.data;
}

export async function getAdminComplaints(params?: {
  status?: string;
  severity?: string;
  category?: string;
  limit?: number;
}): Promise<Record<string, unknown>[]> {
  const response = await apiClient.get<Record<string, unknown>[]>("/admin/complaints", { params });
  return response.data;
}

export async function updateComplaintStatus(
  id: string,
  status: string,
  department?: string,
  notes?: string
): Promise<Record<string, unknown>> {
  const response = await apiClient.put<Record<string, unknown>>(`/admin/complaints/${id}`, {
    status,
    assigned_department: department,
    resolution_notes: notes,
  });
  return response.data;
}

export async function getAdminUsers(params?: {
  status?: string;
  role?: string;
}): Promise<Record<string, unknown>[]> {
  const response = await apiClient.get<Record<string, unknown>[]>("/admin/users", { params });
  return response.data;
}

export async function updateUserStatus(
  userId: string,
  status: "active" | "suspended" | "flagged"
): Promise<Record<string, unknown>> {
  const response = await apiClient.put<Record<string, unknown>>(`/admin/users/${userId}/status`, { status });
  return response.data;
}

export async function getAnalytics(range?: "week" | "month" | "year"): Promise<Record<string, unknown>> {
  const response = await apiClient.get<Record<string, unknown>>("/admin/analytics", {
    params: { range: range ?? "month" },
  });
  return response.data;
}
