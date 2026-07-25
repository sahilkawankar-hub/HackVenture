import React, { useState } from "react";
import {
  MapPin, FileText, ShoppingBag, Briefcase,
  Award, ChevronRight, Camera,
  Edit3, MessageSquare, Star, TrendingUp
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getInitials } from "../lib/utils";
import { useNavigate } from "react-router-dom";

type ProfileTab = "reports" | "posts" | "marketplace" | "jobs" | "achievements";

const ACHIEVEMENTS = [
  { id: "a1", icon: "🏆", title: "First Reporter", desc: "Filed your first civic report", earned: true },
  { id: "a2", icon: "🌟", title: "Community Star", desc: "Received 50+ likes on posts", earned: true },
  { id: "a3", icon: "🔧", title: "Problem Solver", desc: "Had 5 issues resolved", earned: true },
  { id: "a4", icon: "🤝", title: "Connector", desc: "Joined 3+ communities", earned: false },
  { id: "a5", icon: "🎯", title: "Marksman", desc: "AI detection accuracy > 95%", earned: false },
  { id: "a6", icon: "📢", title: "Announcer", desc: "Made 10+ community posts", earned: false },
];

const RECENT_REPORTS = [
  { id: "CE-9041", title: "Deep Pothole on Elm Street", status: "in_progress", category: "Roads & Potholes", timeAgo: "25 min ago" },
  { id: "CE-8920", title: "Burst Water Pipe near 5th Ave", status: "resolved", category: "Water & Drainage", timeAgo: "1 day ago" },
  { id: "CE-7712", title: "Broken Streetlight #42", status: "resolved", category: "Electrical", timeAgo: "2 days ago" },
];

const STATS = [
  { label: "Reports Filed", value: "12", icon: <FileText className="w-4 h-4" />, color: "text-[#2563eb] bg-blue-50 dark:bg-blue-900/20" },
  { label: "Issues Resolved", value: "9",  icon: <TrendingUp className="w-4 h-4" />, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
  { label: "Community Posts", value: "24", icon: <MessageSquare className="w-4 h-4" />, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
  { label: "Reputation",      value: "94", icon: <Star className="w-4 h-4" />, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
];

function getStatusBadge(status: string) {
  if (status === "resolved") return "badge-green";
  if (status === "in_progress") return "badge-amber";
  if (status === "open") return "badge-blue";
  return "badge-gray";
}

function getStatusLabel(status: string) {
  if (status === "in_progress") return "In Progress";
  if (status === "resolved") return "Resolved";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>("reports");

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Community Member";

  const initials = getInitials(displayName);
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const email = user?.email || "";

  const tabs: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { id: "reports",      label: "My Reports",    icon: <FileText className="w-4 h-4" /> },
    { id: "posts",        label: "My Posts",       icon: <MessageSquare className="w-4 h-4" /> },
    { id: "marketplace",  label: "Marketplace",    icon: <ShoppingBag className="w-4 h-4" /> },
    { id: "jobs",         label: "Jobs",           icon: <Briefcase className="w-4 h-4" /> },
    { id: "achievements", label: "Achievements",   icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="p-7 max-w-4xl mx-auto space-y-6">

        {/* ── Profile Header ────────────────────────────────────────────── */}
        <div
          className="rounded-3xl p-8 relative overflow-hidden text-white"
          style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #6366f1 100%)" }}
        >
          {/* Background decoration */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -right-4 bottom-0 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white/20">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-3xl font-black">
                    {initials}
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate("/settings")}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Camera className="w-3.5 h-3.5 text-[#2563eb]" />
              </button>
            </div>

            {/* Name & info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-extrabold text-white">{displayName}</h1>
                <span className="px-2.5 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full border border-white/20">
                  Resident · Level 4
                </span>
              </div>
              <p className="text-white/80 text-sm mb-1">{email}</p>
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <MapPin className="w-3.5 h-3.5" />
                Greenwood Heights Community
              </div>
              <p className="text-white/75 text-sm mt-2 max-w-md">
                Long-time resident passionate about community wellness and green spaces. Active civic reporter.
              </p>
            </div>

            {/* Edit button */}
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-sm font-semibold text-white transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          {/* Stats Row */}
          <div className="relative z-10 mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[11px] text-white/70 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1 bg-white dark:bg-slate-800/60 rounded-2xl p-1.5 border border-[#e2e8f0] dark:border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "text-[#475569] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ───────────────────────────────────────────────── */}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>My Civic Reports</h2>
              <button
                onClick={() => navigate("/civic-eye")}
                className="text-[12px] font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {RECENT_REPORTS.map((report) => (
              <div key={report.id} className="card p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate("/civic-eye")}>
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <FileText className="w-5 h-5 text-[#2563eb]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                    {report.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{report.id}</span>
                    <span className="text-[#94a3b8]">·</span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{report.category}</span>
                    <span className="text-[#94a3b8]">·</span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{report.timeAgo}</span>
                  </div>
                </div>
                <span className={`badge ${getStatusBadge(report.status)}`}>
                  {getStatusLabel(report.status)}
                </span>
              </div>
            ))}
            <button
              onClick={() => navigate("/civic-eye")}
              className="w-full py-3 rounded-2xl text-sm font-semibold border-2 border-dashed transition-all hover:border-[#2563eb] hover:text-[#2563eb]"
              style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
            >
              + Report a New Issue
            </button>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mx-auto">
              <MessageSquare className="w-8 h-8 text-purple-500" />
            </div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Your Community Posts</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Posts you create in the community feed will appear here.</p>
            <button
              onClick={() => navigate("/feed")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all"
            >
              Go to Community Feed
            </button>
          </div>
        )}

        {/* Marketplace Tab */}
        {activeTab === "marketplace" && (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Your Marketplace Listings</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Items you list for sale will appear here.</p>
            <button
              onClick={() => navigate("/marketplace")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all"
            >
              Browse Marketplace
            </button>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8 text-sky-500" />
            </div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Your Job Activity</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Saved jobs and applications will appear here.</p>
            <button
              onClick={() => navigate("/jobs")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all"
            >
              Find Local Jobs
            </button>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>Achievements</h2>
              <span className="badge badge-blue">3 / {ACHIEVEMENTS.length} Earned</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACHIEVEMENTS.map((ach) => (
                <div
                  key={ach.id}
                  className={`card p-4 flex items-center gap-4 transition-all ${
                    ach.earned ? "opacity-100" : "opacity-40 grayscale"
                  }`}
                >
                  <span className="text-3xl">{ach.icon}</span>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>{ach.title}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{ach.desc}</p>
                    {ach.earned && (
                      <span className="badge badge-green mt-1">Earned</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;
