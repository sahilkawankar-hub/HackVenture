import React from "react";
import { Sparkles, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { AIDetectionResult } from "../../types/civicEye";

interface AIDetectionBadgeProps {
  result: AIDetectionResult;
}

export const AIDetectionBadge: React.FC<AIDetectionBadgeProps> = ({ result }) => {
  const confidencePercent = Math.round(
    result.confidence_score > 1 ? result.confidence_score : result.confidence_score * 100
  );

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return {
          bg: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
          icon: <ShieldAlert className="w-3.5 h-3.5 text-red-500" />,
        };
      case "high":
        return {
          bg: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
        };
      case "medium":
        return {
          bg: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />,
        };
      default:
        return {
          bg: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />,
        };
    }
  };

  const priorityStyle = getPriorityBadge(result.priority);

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-blue-50/80 dark:from-slate-800/80 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm backdrop-blur-sm transition-all duration-300">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            YOLO AI Detector Analysis
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityStyle.bg}`}
          >
            {priorityStyle.icon}
            <span className="capitalize">{result.priority} Priority</span>
          </span>
        </div>
      </div>

      <div className="mt-3">
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          {result.detected_issue}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          Suggested Category: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{result.suggested_category}</span>
        </p>
      </div>

      {/* Confidence Score Bar */}
      <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/50">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-600 dark:text-slate-400 font-medium">Detection Confidence Score</span>
          <span className="font-bold text-indigo-700 dark:text-indigo-300">{confidencePercent}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {result.labels && result.labels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {result.labels.map((label, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300"
            >
              #{label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
