/**
 * API module — barrel export for all API service functions.
 */

export { default as apiClient } from "../lib/axios";

export * from "./auth";
export * from "./feed";
export * from "./civicEye";
export * from "./lostFound";
export * from "./marketplace";
export * from "./jobs";
export * from "./admin";
export * from "./community";
export * from "./notifications";
