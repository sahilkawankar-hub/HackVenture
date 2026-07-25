/**
 * Notifications API client.
 */
import apiClient from "../lib/axios";
import { Notification } from "../types";

export async function getNotifications(params?: {
  is_read?: boolean;
  page?: number;
  page_size?: number;
}): Promise<Notification[]> {
  const response = await apiClient.get<Notification[]>("/notifications", { params });
  return response.data;
}

export async function markAsRead(notificationId: string): Promise<Notification> {
  const response = await apiClient.put<Notification>(`/notifications/${notificationId}/read`);
  return response.data;
}

export async function markAllAsRead(): Promise<void> {
  await apiClient.put("/notifications/read-all");
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await apiClient.delete(`/notifications/${notificationId}`);
}

export async function getUnreadCount(): Promise<number> {
  const response = await apiClient.get<{ count: number }>("/notifications/unread-count");
  return response.data.count;
}
