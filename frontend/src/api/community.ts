/**
 * Community management API client.
 */
import apiClient from "../lib/axios";
import { Community, CommunityMember, JoinRequest } from "../types";

export interface CreateCommunityPayload {
  name: string;
  description?: string;
  community_type: "apartment_society" | "neighborhood" | "interest_based" | "other";
  join_policy: "public" | "approval_required" | "invite_only";
  address?: string;
  latitude?: number;
  longitude?: number;
  rules?: string;
  tags?: string[];
  max_members?: number;
}

export async function getCommunities(params?: {
  search?: string;
  community_type?: string;
  page?: number;
}): Promise<Community[]> {
  const response = await apiClient.get<Community[]>("/community/communities", { params });
  return response.data;
}

export async function getCommunity(id: string): Promise<Community> {
  const response = await apiClient.get<Community>(`/community/communities/${id}`);
  return response.data;
}

export async function createCommunity(
  payload: CreateCommunityPayload,
  coverImage?: File,
  logoImage?: File
): Promise<Community> {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      formData.append(key, typeof val === "object" ? JSON.stringify(val) : String(val));
    }
  });
  if (coverImage) formData.append("cover_image", coverImage);
  if (logoImage)  formData.append("logo_image", logoImage);

  const response = await apiClient.post<Community>("/community/communities", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function joinCommunity(communityId: string, message?: string): Promise<CommunityMember | JoinRequest> {
  const response = await apiClient.post(`/community/communities/${communityId}/join`, { message });
  return response.data;
}

export async function leaveCommunity(communityId: string): Promise<void> {
  await apiClient.delete(`/community/communities/${communityId}/leave`);
}

export async function getCommunityMembers(communityId: string): Promise<CommunityMember[]> {
  const response = await apiClient.get<CommunityMember[]>(`/community/communities/${communityId}/members`);
  return response.data;
}

export async function getJoinRequests(communityId: string): Promise<JoinRequest[]> {
  const response = await apiClient.get<JoinRequest[]>(`/community/communities/${communityId}/join-requests`);
  return response.data;
}

export async function approveJoinRequest(communityId: string, requestId: string): Promise<JoinRequest> {
  const response = await apiClient.post<JoinRequest>(
    `/community/communities/${communityId}/join-requests/${requestId}/approve`
  );
  return response.data;
}

export async function rejectJoinRequest(communityId: string, requestId: string): Promise<JoinRequest> {
  const response = await apiClient.post<JoinRequest>(
    `/community/communities/${communityId}/join-requests/${requestId}/reject`
  );
  return response.data;
}

export async function updateMemberRole(
  communityId: string,
  userId: string,
  role: "admin" | "moderator" | "member"
): Promise<CommunityMember> {
  const response = await apiClient.put<CommunityMember>(
    `/community/communities/${communityId}/members/${userId}/role`,
    { role }
  );
  return response.data;
}

export async function getMyCommunities(): Promise<Community[]> {
  const response = await apiClient.get<Community[]>("/community/my-communities");
  return response.data;
}
