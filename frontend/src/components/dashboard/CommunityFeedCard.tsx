import { useNavigate } from "react-router-dom";
import { useState } from "react";

/** Static feed post data — replace with API call when backend is ready. */
const staticPosts = [
  {
    id: "1",
    type: "announcement" as const,
    author: "HOA Announcement",
    time: "2 hours ago",
    body: "The main pool will be closed for maintenance tomorrow from 8 AM to 2 PM. We apologize for the inconvenience.",
    hasImage: true,
  },
  {
    id: "2",
    type: "resident" as const,
    author: "Sarah Jenkins",
    initials: "SJ",
    time: "5 hours ago",
    body: "Anyone lose a set of keys near the north playground? Found them on the bench this afternoon!",
    likes: 12,
    comments: 3,
  },
];

/**
 * CommunityFeedCard — mini scrollable feed preview.
 * "View All" routes to /feed.
 * Spans 4 of 12 columns on desktop, h-[500px] to align with map card.
 */
function CommunityFeedCard() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  return (
    <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl shadow-sm border border-[#c3c6d7]/50 overflow-hidden flex flex-col h-[500px] hover:shadow-md transition-all">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#c3c6d7]/40 flex justify-between items-center flex-shrink-0">
        <h3 className="text-[16px] font-semibold text-[#0b1c30]">
          Community Feed
        </h3>
        <button
          id="feed-view-all-btn"
          onClick={() => navigate("/feed")}
          className="text-[#004ac6] text-[13px] font-semibold hover:underline"
        >
          View All
        </button>
      </div>

      {/* Feed list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-5">
        {/* ── Post 1: HOA Announcement ─────────────────────────────────── */}
        <div className="space-y-3 border-b border-[#c3c6d7]/30 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#006c49] flex items-center justify-center text-white flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">campaign</span>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0b1c30]">HOA Announcement</p>
              <p className="text-[11px] text-[#434655]">2 hours ago</p>
            </div>
          </div>
          <p className="text-[13px] text-[#434655] leading-relaxed">
            The main pool will be closed for maintenance tomorrow from 8 AM to
            2 PM. We apologize for the inconvenience.
          </p>
          {/* Pool image placeholder */}
          <div className="w-full h-36 rounded-xl bg-gradient-to-br from-[#dce9ff] via-[#e5eeff] to-[#c0c1ff] flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-[48px] text-[#004ac6]/30">
              pool
            </span>
          </div>
        </div>

        {/* ── Post 2: Sarah Jenkins ────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              SJ
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0b1c30]">Sarah Jenkins</p>
              <p className="text-[11px] text-[#434655]">5 hours ago</p>
            </div>
          </div>
          <p className="text-[13px] text-[#434655] leading-relaxed">
            Anyone lose a set of keys near the north playground? Found them on
            the bench this afternoon!
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setLiked((v) => !v)}
              className={`flex items-center gap-1.5 transition-colors ${
                liked ? "text-red-500" : "text-[#434655] hover:text-red-400"
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
            <button className="flex items-center gap-1.5 text-[#434655] hover:text-[#004ac6] transition-colors">
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
