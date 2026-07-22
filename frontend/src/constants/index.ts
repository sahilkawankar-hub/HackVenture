/**
 * Application-wide constants.
 */

export const APP_NAME = "CiviLink AI";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const CIVIC_ISSUE_CATEGORIES = [
  "Pothole",
  "Garbage",
  "Streetlight",
  "Water Leak",
  "Road Damage",
  "Broken Infrastructure",
  "Noise",
  "Encroachment",
  "Other",
] as const;

export const CIVIC_ISSUE_SEVERITIES = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const JOB_TYPES = [
  "full_time",
  "part_time",
  "freelance",
  "one_time",
] as const;

export const ITEM_CONDITIONS = [
  "new",
  "like_new",
  "good",
  "fair",
] as const;

export const MARKETPLACE_CATEGORIES = [
  "Electronics",
  "Furniture",
  "Books",
  "Clothing",
  "Sports",
  "Vehicles",
  "Home & Kitchen",
  "Other",
] as const;

export const PAGINATION_DEFAULT_PAGE_SIZE = 20;
