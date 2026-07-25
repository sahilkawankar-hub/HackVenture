/**
 * Community Feed API client.
 */
import apiClient from "../lib/axios";
import { Post, Comment, PaginatedResponse } from "../types";

export interface CreatePostPayload {
  community_id: string;
  title?: string;
  content: string;
  category?: "Announcement" | "Discussion" | "Question" | "Event";
  hashtags?: string[];
}

export async function getFeedPosts(params?: {
  community_id?: string;
  category?: string;
  search?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<Post>> {
  const response = await apiClient.get<PaginatedResponse<Post>>("/feed/posts", { params });
  return response.data;
}

export async function createPost(
  payload: CreatePostPayload,
  imageFile?: File
): Promise<Post> {
  if (imageFile) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        formData.append(key, typeof val === "object" ? JSON.stringify(val) : String(val));
      }
    });
    formData.append("file", imageFile);
    const response = await apiClient.post<Post>("/feed/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  const response = await apiClient.post<Post>("/feed/posts", payload);
  return response.data;
}

export async function likePost(postId: string): Promise<Post> {
  const response = await apiClient.post<Post>(`/feed/posts/${postId}/like`);
  return response.data;
}

export async function unlikePost(postId: string): Promise<Post> {
  const response = await apiClient.delete<Post>(`/feed/posts/${postId}/like`);
  return response.data;
}

export async function getPostComments(postId: string): Promise<Comment[]> {
  const response = await apiClient.get<Comment[]>(`/feed/posts/${postId}/comments`);
  return response.data;
}

export async function addComment(postId: string, content: string): Promise<Comment> {
  const response = await apiClient.post<Comment>(`/feed/posts/${postId}/comments`, { content });
  return response.data;
}

export async function deletePost(postId: string): Promise<void> {
  await apiClient.delete(`/feed/posts/${postId}`);
}

export async function pinPost(postId: string): Promise<Post> {
  const response = await apiClient.post<Post>(`/feed/posts/${postId}/pin`);
  return response.data;
}
