/**
 * Utility helpers — clsx-like className merger.
 * Keeps the project dependency-light without adding clsx.
 */

type ClassValue = string | undefined | null | false | Record<string, boolean>;

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  return classes.join(" ");
}

/**
 * Format a number with compact notation (1.2k, 3.4M).
 */
export function formatCount(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return String(num);
}

/**
 * Format date as relative time ("2 hours ago", "3 days ago").
 */
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Truncate a string to maxLength characters, appending "...".
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

/**
 * Get user initials from a full name.
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get severity color classes.
 */
export function getSeverityClasses(severity: string): { bg: string; text: string; dot: string } {
  switch (severity.toLowerCase()) {
    case "critical":
      return { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" };
    case "high":
      return { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-500" };
    case "medium":
      return { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" };
    case "low":
    default:
      return { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" };
  }
}

/**
 * Get status label and color classes for civic issue status.
 */
export function getStatusMeta(status: string): { label: string; bg: string; text: string } {
  switch (status) {
    case "open":
      return { label: "Open",           bg: "bg-blue-100 dark:bg-blue-900/30",    text: "text-blue-700 dark:text-blue-400" };
    case "ai_processing":
      return { label: "AI Processing",  bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" };
    case "pending_review":
      return { label: "Pending Review", bg: "bg-amber-100 dark:bg-amber-900/30",  text: "text-amber-700 dark:text-amber-400" };
    case "assigned":
      return { label: "Assigned",       bg: "bg-sky-100 dark:bg-sky-900/30",      text: "text-sky-700 dark:text-sky-400" };
    case "in_progress":
      return { label: "In Progress",    bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" };
    case "resolved":
      return { label: "Resolved",       bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" };
    case "closed":
      return { label: "Closed",         bg: "bg-slate-100 dark:bg-slate-800",     text: "text-slate-600 dark:text-slate-400" };
    default:
      return { label: status,           bg: "bg-slate-100",                         text: "text-slate-600" };
  }
}
