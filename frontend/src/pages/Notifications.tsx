import { useState } from "react";
import {
  Bell, Check, CheckCheck, Trash2,
  AlertTriangle, MessageSquare, Briefcase,
  ShoppingBag, Users, Megaphone, Sparkles
} from "lucide-react";
import { Notification, NotificationType } from "../types";
import { timeAgo } from "../lib/utils";
import { SkeletonCard } from "../components/common/SkeletonLoader";
import { EmptyState } from "../components/common/EmptyState";

// Seed notifications for demo
const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    user_id: "demo",
    type: "complaint_update",
    title: "Issue Update — CE-9041",
    body: "Your reported pothole on Elm Street has been assigned to Public Works Division and is now In Progress.",
    link: "/civic-eye",
    is_read: false,
    created_at: new Date(Date.now() - 1800000).toISOString(),
    metadata: {},
  },
  {
    id: "n2",
    user_id: "demo",
    type: "lost_found_match",
    title: "AI Match Found! 🎯",
    body: "CivicEye AI found a 98% match for your lost Golden Retriever 'Barnaby'. Someone found a similar dog nearby.",
    link: "/lost-found",
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    metadata: {},
  },
  {
    id: "n3",
    user_id: "demo",
    type: "community_approval",
    title: "Community Join Approved",
    body: "You have been approved to join Greenwood Heights HOA community.",
    link: "/community",
    is_read: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    metadata: {},
  },
  {
    id: "n4",
    user_id: "demo",
    type: "comment",
    title: "New Comment on Your Post",
    body: "Marcus Vance commented: \"Great news! Will there be vegetarian options at the BBQ?\"",
    link: "/feed",
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    metadata: {},
  },
  {
    id: "n5",
    user_id: "demo",
    type: "job_update",
    title: "Job Application Status",
    body: "Your application for 'High School Math Tutor' has been reviewed by Dr. Aris Thorne.",
    link: "/jobs",
    is_read: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    metadata: {},
  },
  {
    id: "n6",
    user_id: "demo",
    type: "announcement",
    title: "Community Announcement",
    body: "Greenwood HOA Board: The main swimming pool will be closed tomorrow from 8 AM to 2 PM for seasonal maintenance.",
    link: "/feed",
    is_read: true,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    metadata: {},
  },
];

function getNotifIcon(type: NotificationType) {
  const base = "w-5 h-5";
  switch (type) {
    case "complaint_update":   return <AlertTriangle className={`${base} text-amber-500`} />;
    case "lost_found_match":   return <Sparkles className={`${base} text-purple-500`} />;
    case "community_approval": return <Users className={`${base} text-emerald-500`} />;
    case "comment":            return <MessageSquare className={`${base} text-blue-500`} />;
    case "like":               return <Bell className={`${base} text-red-500`} />;
    case "job_update":         return <Briefcase className={`${base} text-sky-500`} />;
    case "marketplace_message":return <ShoppingBag className={`${base} text-orange-500`} />;
    case "announcement":       return <Megaphone className={`${base} text-indigo-500`} />;
    case "join_request":       return <Users className={`${base} text-teal-500`} />;
    default:                   return <Bell className={`${base} text-[#2563eb]`} />;
  }
}

function getNotifBg(type: NotificationType) {
  switch (type) {
    case "complaint_update":   return "bg-amber-50 dark:bg-amber-900/20";
    case "lost_found_match":   return "bg-purple-50 dark:bg-purple-900/20";
    case "community_approval": return "bg-emerald-50 dark:bg-emerald-900/20";
    case "comment":            return "bg-blue-50 dark:bg-blue-900/20";
    case "job_update":         return "bg-sky-50 dark:bg-sky-900/20";
    case "marketplace_message":return "bg-orange-50 dark:bg-orange-900/20";
    case "announcement":       return "bg-indigo-50 dark:bg-indigo-900/20";
    default:                   return "bg-[#eff6ff] dark:bg-blue-900/20";
  }
}

const FILTERS = ["All", "Unread", "Updates", "Community", "Jobs", "Matches"] as const;

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const [loading] = useState(false);
  const [filter, setFilter] = useState<string>("All");

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "Unread") return !n.is_read;
    if (filter === "Updates") return n.type === "complaint_update";
    if (filter === "Community") return ["community_approval", "announcement", "join_request", "comment"].includes(n.type);
    if (filter === "Jobs") return n.type === "job_update";
    if (filter === "Matches") return n.type === "lost_found_match";
    return true;
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="p-7 max-w-3xl mx-auto space-y-6">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Notifications
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
              style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* ── Filter Pills ──────────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-[#475569] dark:text-slate-400 border border-[#e2e8f0] dark:border-slate-700 hover:border-[#2563eb] hover:text-[#2563eb]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Notification List ─────────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-8 h-8" />}
            title="No notifications"
            description="You're all caught up! New notifications will appear here."
          />
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`card p-4 flex items-start gap-4 transition-all cursor-pointer group ${
                  !notif.is_read ? "ring-2 ring-[#2563eb]/15 shadow-blue-sm" : ""
                }`}
                onClick={() => handleMarkRead(notif.id)}
              >
                {/* Icon */}
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${getNotifBg(notif.type)}`}>
                  {getNotifIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-[13px] font-semibold leading-snug ${!notif.is_read ? "text-[#0f1f3d] dark:text-white" : "text-[#475569] dark:text-slate-300"}`}>
                      {notif.title}
                    </p>
                    <span className="text-[11px] whitespace-nowrap flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                      {timeAgo(notif.created_at)}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {notif.body}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  {!notif.is_read && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMarkRead(notif.id); }}
                      className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-[#2563eb] transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Unread dot */}
                {!notif.is_read && (
                  <div className="w-2 h-2 rounded-full bg-[#2563eb] flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
