/**
 * Lost & Found API client.
 */
import apiClient from "../lib/axios";
import { LostFoundItem, MatchSuggestion, PaginatedResponse } from "../types";

export interface CreateLostFoundPayload {
  community_id: string;
  item_type: "lost" | "found";
  title: string;
  description: string;
  category?: string;
  location_description?: string;
  date_lost_found?: string;
  latitude?: number;
  longitude?: number;
}

export async function getLostFoundItems(params?: {
  community_id?: string;
  item_type?: "lost" | "found";
  category?: string;
  search?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<LostFoundItem>> {
  const response = await apiClient.get<PaginatedResponse<LostFoundItem>>(
    "/lost-found/items",
    { params }
  );
  return response.data;
}

export async function getLostFoundItem(id: string): Promise<LostFoundItem> {
  const response = await apiClient.get<LostFoundItem>(`/lost-found/items/${id}`);
  return response.data;
}

export async function reportLostFound(
  payload: CreateLostFoundPayload,
  imageFile?: File
): Promise<LostFoundItem> {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      formData.append(key, String(val));
    }
  });
  if (imageFile) formData.append("file", imageFile);

  const response = await apiClient.post<LostFoundItem>("/lost-found/items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function getMatches(itemId: string): Promise<MatchSuggestion[]> {
  const response = await apiClient.get<MatchSuggestion[]>(`/lost-found/items/${itemId}/matches`);
  return response.data;
}

export async function claimItem(itemId: string): Promise<LostFoundItem> {
  const response = await apiClient.post<LostFoundItem>(`/lost-found/items/${itemId}/claim`);
  return response.data;
}

export async function closeItem(itemId: string): Promise<LostFoundItem> {
  const response = await apiClient.put<LostFoundItem>(`/lost-found/items/${itemId}/close`);
  return response.data;
}
