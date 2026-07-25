import { useNavigate } from "react-router-dom";
import { useState } from "react";

/**
 * CommunityFeedCard — mini scrollable feed preview.
 * "View All" routes to /feed.
 * Spans 4 of 12 columns on desktop, h-[500px] to align with map card.
 */
function CommunityFeedCard() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  return (
    <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-slate-800 overflow-hidden flex flex-col h-[500px] hover:shadow-md transition-all">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#e2e8f0] dark:border-slate-800 flex justify-between items-center flex-shrink-0">
        <h3 className="text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Community Feed
        </h3>
        <button
          id="feed-view-all-btn"
          onClick={() => navigate("/feed")}
          className="text-[#2563eb] text-[13px] font-semibold hover:underline"
        >
          View All
        </button>
      </div>

      {/* Feed list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-5">
        {/* ── Post 1: HOA Announcement ─────────────────────────────────── */}
        <div className="space-y-3 border-b border-[#e2e8f0] dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#10b981] flex items-center justify-center text-white flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">campaign</span>
            </div>
            <div>
              <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>HOA Announcement</p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>2 hours ago</p>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            The main pool will be closed for maintenance tomorrow from 8 AM to
            2 PM. We apologize for the inconvenience.
          </p>
          {/* Pool image placeholder */}
          <div className="w-full h-36 rounded-xl bg-gradient-to-br from-[#dce9ff] via-[#e5eeff] to-[#c0c1ff] dark:from-slate-800 dark:to-slate-700 flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-[48px] text-[#2563eb]/30">
              pool
            </span>
          </div>
        </div>

        {/* ── Post 2: Sarah Jenkins ────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              SJ
            </div>
            <div>
              <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Sarah Jenkins</p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>5 hours ago</p>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Anyone lose a set of keys near the north playground? Found them on
            the bench this afternoon!
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setLiked((v) => !v)}
              className={`flex items-center gap-1.5 transition-colors ${
                liked ? "text-red-500" : "text-[#94a3b8] hover:text-red-400"
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={liked ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                favorite
              </span>
              <span className="text-[11px] font-semibold">{liked ? 13 : 12}</span>
            </button>
            <button className="flex items-center gap-1.5 text-[#94a3b8] hover:text-[#2563eb] transition-colors">
              <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
              <span className="text-[11px] font-semibold">3</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityFeedCard;
