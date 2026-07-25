/**
 * Marketplace API client.
 */
import apiClient from "../lib/axios";
import { MarketplaceListing, PaginatedResponse } from "../types";

export interface CreateListingPayload {
  community_id: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  category: string;
  condition: "new" | "like_new" | "good" | "fair";
}

export async function getListings(params?: {
  community_id?: string;
  category?: string;
  condition?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<MarketplaceListing>> {
  const response = await apiClient.get<PaginatedResponse<MarketplaceListing>>(
    "/marketplace/listings",
    { params }
  );
  return response.data;
}

export async function getListing(id: string): Promise<MarketplaceListing> {
  const response = await apiClient.get<MarketplaceListing>(`/marketplace/listings/${id}`);
  return response.data;
}

export async function createListing(
  payload: CreateListingPayload,
  images?: File[]
): Promise<MarketplaceListing> {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      formData.append(key, String(val));
    }
  });
  images?.forEach((img) => formData.append("files", img));

  const response = await apiClient.post<MarketplaceListing>(
    "/marketplace/listings",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}

export async function updateListingStatus(
  id: string,
  status: "active" | "sold" | "reserved" | "removed"
): Promise<MarketplaceListing> {
  const response = await apiClient.put<MarketplaceListing>(`/marketplace/listings/${id}/status`, { status });
  return response.data;
}

export async function wishlistListing(id: string): Promise<void> {
  await apiClient.post(`/marketplace/listings/${id}/wishlist`);
}

export async function unwishlistListing(id: string): Promise<void> {
  await apiClient.delete(`/marketplace/listings/${id}/wishlist`);
}

export async function getMyListings(): Promise<MarketplaceListing[]> {
  const response = await apiClient.get<MarketplaceListing[]>("/marketplace/my-listings");
  return response.data;
}
