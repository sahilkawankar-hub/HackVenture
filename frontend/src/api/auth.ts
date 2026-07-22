/**
 * Authentication API calls.
 */

import apiClient from "../lib/axios";

export async function loginWithToken(firebaseToken: string) {
  const response = await apiClient.post("/auth/login", {
    firebase_token: firebaseToken,
  });
  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get("/auth/me");
  return response.data;
}

export async function updateProfile(data: Record<string, unknown>) {
  const response = await apiClient.put("/auth/me", data);
  return response.data;
}
