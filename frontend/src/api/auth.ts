/**
 * Auth API client.
 */
import apiClient from "../lib/axios";

export async function getCurrentUser(): Promise<Record<string, unknown>> {
  const response = await apiClient.get<Record<string, unknown>>("/auth/me");
  return response.data;
}

export async function syncUser(data: {
  email: string;
  display_name?: string;
  photo_url?: string;
}): Promise<Record<string, unknown>> {
  const response = await apiClient.post<Record<string, unknown>>("/auth/sync", data);
  return response.data;
}
