import React, { useState } from "react";
import { Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, PlusCircle, LayoutGrid } from "lucide-react";
import { ComplaintForm } from "../components/civic-eye/ComplaintForm";
import { IssueList } from "../components/civic-eye/IssueList";

/**
 * CivicEye AI page - AI-powered civic issue reporting & community resolution tracking.
 */
function CivicEye() {
  const [activeTab, setActiveTab] = useState<"board" | "report">("report");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Banner Header */}
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 md:p-10 shadow-2xl overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-40 -top-20 w-60 h-60 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
                <span>YOLO v8 Object Detection & Semantic Intelligence</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                CivicEye AI Issue Reporter
              </h1>
              <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
                Snap or upload photos of neighborhood issues like potholes, overflowing waste, or broken streetlights. Our AI automatically classifies the issue, measures urgency, and routes it to administrators.
              </p>
            </div>

            {/* Quick Action Switcher Button */}
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => setActiveTab("report")}
                className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
                  activeTab === "report"
                    ? "bg-white text-indigo-900 shadow-white/20 scale-105"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                Report Issue
              </button>
              <button
                onClick={() => setActiveTab("board")}
                className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
                  activeTab === "board"
                    ? "bg-white text-indigo-900 shadow-white/20 scale-105"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Community Board
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <p className="text-[11px] font-medium text-indigo-200 uppercase tracking-wider">AI Accuracy</p>
              <p className="text-xl font-black text-white mt-0.5">96.4%</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <p className="text-[11px] font-medium text-indigo-200 uppercase tracking-wider">Detection Speed</p>
              <p className="text-xl font-black text-emerald-300 mt-0.5">&lt; 0.8s</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <p className="text-[11px] font-medium text-indigo-200 uppercase tracking-wider">Avg Resolution</p>
              <p className="text-xl font-black text-amber-300 mt-0.5">24 Hours</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <p className="text-[11px] font-medium text-indigo-200 uppercase tracking-wider">Supported Defects</p>
              <p className="text-xl font-black text-purple-200 mt-0.5">5+ Classes</p>
            </div>
          </div>
        </div>

        {/* Tab View Content */}
        <div>
          {activeTab === "report" ? (
            <div className="space-y-6">
              <ComplaintForm
                onSuccess={(newIssue) => {
                  setRefreshTrigger((prev) => prev + 1);
                  setActiveTab("board");
                }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <IssueList refreshTrigger={refreshTrigger} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CivicEye;
