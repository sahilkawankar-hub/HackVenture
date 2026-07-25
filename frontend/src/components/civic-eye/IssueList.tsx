import React, { useState, useEffect } from "react";
import { Search, ThumbsUp, MapPin, Clock } from "lucide-react";
import { CivicIssue } from "../../types";
import { getCivicIssues, upvoteCivicIssue } from "../../api/civicEye";
import { SkeletonIssueCard } from "../common/SkeletonLoader";
import { EmptyState } from "../common/EmptyState";
import { timeAgo, getSeverityClasses, getStatusMeta } from "../../lib/utils";

const DEMO_ISSUES: CivicIssue[] = [
  {
    id: "CE-9041",
    reporter_id: "u-1",
    community_id: "c1",
    title: "Deep Pothole on Elm Street",
    description: "Deep asphalt pothole approximately 8cm deep near 12 Elm Street.",
    category: "Potholes & Road Damage",
    severity: "high",
    status: "in_progress",
    image_urls: ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"],
    ai_detected_labels: ["Asphalt Pothole"],
    ai_confidence: 0.968,
    ai_bounding_boxes: null,
    model_source: "YOLOv8",
    latitude: 40.6654,
    longitude: -73.9876,
    address: "12 Elm St, Greenwood Heights",
    upvote_count: 24,
    is_anonymous: false,
    assigned_department: "Public Works & Infrastructure",
    resolution_notes: null,
    created_at: new Date(Date.now() - 1500000).toISOString(),
    resolved_at: null,
  },
  {
    id: "CE-8920",
    reporter_id: "u-2",
    community_id: "c1",
    title: "Burst Water Pipe near 5th Ave",
    description: "Water leaking heavily on 5th Ave & Park Rd junction.",
    category: "Water Leakage & Drainage",
    severity: "critical",
    status: "in_progress",
    image_urls: ["https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80"],
    ai_detected_labels: ["Water Main Leak"],
    ai_confidence: 0.991,
    ai_bounding_boxes: null,
    model_source: "YOLOv8",
    latitude: 40.6680,
    longitude: -73.9850,
    address: "5th Ave & Park Rd Junction",
    upvote_count: 42,
    is_anonymous: false,
    assigned_department: "Water & Sanitation Dept",
    resolution_notes: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    resolved_at: null,
  },
  {
    id: "CE-7712",
    reporter_id: "u-3",
    community_id: "c1",
    title: "Broken Streetlight Lamp #42",
    description: "Streetlight not turning on at night near 88 Maple Ave.",
    category: "Streetlight & Electrical",
    severity: "low",
    status: "resolved",
    image_urls: null,
    ai_detected_labels: ["Bulb Burnout"],
    ai_confidence: 0.942,
    ai_bounding_boxes: null,
    model_source: "YOLOv8",
    latitude: 40.6630,
    longitude: -73.9890,
    address: "88 Maple Ave",
    upvote_count: 15,
    is_anonymous: true,
    assigned_department: "Municipal Power & Lighting",
    resolution_notes: "LED fixture replaced",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    resolved_at: new Date(Date.now() - 36000000).toISOString(),
  },
];

interface IssueListProps {
  refreshTrigger?: number;
}

export const IssueList: React.FC<IssueListProps> = ({ refreshTrigger }) => {
  const [issues, setIssues] = useState<CivicIssue[]>(DEMO_ISSUES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    getCivicIssues()
      .then((data) => {
        if (data && data.length > 0) setIssues(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  const handleUpvote = async (issueId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await upvoteCivicIssue(issueId);
    } catch {}
    setIssues((prev) =>
      prev.map((item) =>
        item.id === issueId ? { ...item, upvote_count: item.upvote_count + 1 } : item
      )
    );
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* ── Filters & Search ─────────────────────────────────────────── */}
      <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search civic issues..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {["all", "open", "in_progress", "resolved"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-[#475569] dark:text-slate-400"
              }`}
            >
              {st === "all" ? "All Statuses" : getStatusMeta(st).label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Issue Cards ──────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <SkeletonIssueCard key={i} />
          ))}
        </div>
      ) : filteredIssues.length === 0 ? (
        <EmptyState
          title="No civic issues found"
          description="Try adjusting your search query or filter settings."
        />
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue) => {
            const sevMeta = getSeverityClasses(issue.severity);
            const statMeta = getStatusMeta(issue.status);

            return (
              <div
                key={issue.id}
                className="card p-5 space-y-3 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-[#2563eb] bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                        {issue.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sevMeta.bg} ${sevMeta.text}`}>
                        {issue.severity.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="text-base font-bold group-hover:text-[#2563eb] transition-colors" style={{ color: "var(--text-primary)" }}>
                      {issue.title}
                    </h4>
                  </div>
                  <span className={`badge ${statMeta.bg} ${statMeta.text}`}>
                    {statMeta.label}
                  </span>
                </div>

                <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {issue.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t text-xs" style={{ borderColor: "var(--border-color)" }}>
                  <div className="flex items-center gap-3 text-[#94a3b8]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2563eb]" />
                      {issue.address || "Greenwood Heights"}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(issue.created_at)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleUpvote(issue.id, e)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#2563eb] font-bold hover:bg-blue-100 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{issue.upvote_count}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
