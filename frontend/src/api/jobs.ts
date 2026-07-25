/**
 * Jobs API client.
 */
import apiClient from "../lib/axios";
import { JobPosting, JobApplication, PaginatedResponse } from "../types";

export interface CreateJobPayload {
  community_id: string;
  title: string;
  description: string;
  job_type: "full_time" | "part_time" | "freelance" | "one_time";
  category: string;
  pay_range?: string;
  location?: string;
  requirements?: string[];
  expires_at?: string;
}

export async function getJobs(params?: {
  community_id?: string;
  category?: string;
  job_type?: string;
  search?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<JobPosting>> {
  const response = await apiClient.get<PaginatedResponse<JobPosting>>("/jobs/postings", { params });
  return response.data;
}

export async function getJob(id: string): Promise<JobPosting> {
  const response = await apiClient.get<JobPosting>(`/jobs/postings/${id}`);
  return response.data;
}

export async function createJob(payload: CreateJobPayload): Promise<JobPosting> {
  const response = await apiClient.post<JobPosting>("/jobs/postings", payload);
  return response.data;
}

export async function applyForJob(
  jobId: string,
  coverNote?: string
): Promise<JobApplication> {
  const response = await apiClient.post<JobApplication>(`/jobs/postings/${jobId}/apply`, {
    cover_note: coverNote,
  });
  return response.data;
}

export async function saveJob(jobId: string): Promise<void> {
  await apiClient.post(`/jobs/postings/${jobId}/save`);
}

export async function unsaveJob(jobId: string): Promise<void> {
  await apiClient.delete(`/jobs/postings/${jobId}/save`);
}

export async function getMyJobs(): Promise<JobPosting[]> {
  const response = await apiClient.get<JobPosting[]>("/jobs/my-postings");
  return response.data;
}

export async function getMyApplications(): Promise<JobApplication[]> {
  const response = await apiClient.get<JobApplication[]>("/jobs/my-applications");
  return response.data;
}
