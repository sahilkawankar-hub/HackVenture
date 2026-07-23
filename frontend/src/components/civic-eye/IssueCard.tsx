import React, { useState } from "react";
import {
  MapPin,
  ThumbsUp,
  Clock,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { CivicIssue } from "../../types/civicEye";
import { upvoteCivicIssue, updateIssueStatus } from "../../api/civicEye";

interface IssueCardProps {
  issue: CivicIssue;
  onIssueUpdated?: (updated: CivicIssue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onIssueUpdated }) => {
  const [upvotes, setUpvotes] = useState(issue.upvote_count || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(issue.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleUpvote = async () => {
    if (hasUpvoted) return;
    try {
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
      const updated = await upvoteCivicIssue(issue.id);
      if (onIssueUpdated) onIssueUpdated(updated);
    } catch (err) {
      console.error("Failed to upvote:", err);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      setCurrentStatus(newStatus as any);
      const updated = await updateIssueStatus(issue.id, newStatus);
      if (onIssueUpdated) onIssueUpdated(updated);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return {
          bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
          text: "Resolved",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
        };
      case "in_progress":
        return {
          bg: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30",
          text: "In Progress",
          icon: <Clock className="w-3.5 h-3.5 text-indigo-500 animate-spin" />,
        };
      default:
        return {
          bg: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
          text: "Open Complaint",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
        };
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30";
      case "high":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "medium":
        return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
      default:
        return "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30";
    }
  };

  const statusStyle = getStatusBadge(currentStatus);
  const confidencePercent = issue.ai_confidence
    ? Math.round(issue.ai_confidence > 1 ? issue.ai_confidence : issue.ai_confidence * 100)
    : null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Image Preview Container */}
      {issue.image_urls && issue.image_urls.length > 0 ? (
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={issue.image_urls[0]}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

          {/* AI Badge Overlay */}
          {confidencePercent !== null && (
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Verified ({confidencePercent}%)</span>
            </div>
          )}

          {/* Status Badge Overlay */}
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${statusStyle.bg}`}
            >
              {statusStyle.icon}
              <span>{statusStyle.text}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Civic Issue Report
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.bg}`}
          >
            {statusStyle.icon}
            <span>{statusStyle.text}</span>
          </span>
        </div>
      )}

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
              {issue.category}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border uppercase tracking-wider ${getSeverityBadge(
                issue.severity
              )}`}
            >
              {issue.severity}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {issue.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>

          {/* AI Detection Labels */}
          {issue.ai_detected_labels && issue.ai_detected_labels.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {issue.ai_detected_labels.map((lbl, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-medium border border-indigo-100 dark:border-indigo-900"
                >
                  #{lbl}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Location & Time Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {issue.address && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
              <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">{issue.address}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(issue.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>

            {/* Admin status switcher */}
            <div className="relative inline-block">
              <select
                disabled={isUpdatingStatus}
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="open">Status: Open</option>
                <option value="in_progress">Status: In Progress</option>
                <option value="resolved">Status: Resolved</option>
                <option value="closed">Status: Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Upvote Button */}
        <button
          onClick={handleUpvote}
          className={`w-full py-2 px-3 rounded-xl border font-medium text-xs flex items-center justify-center gap-2 transition-all ${
            hasUpvoted
              ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
              : "bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? "fill-current" : ""}`} />
          <span>Upvote ({upvotes})</span>
        </button>
      </div>
    </div>
  );
};
