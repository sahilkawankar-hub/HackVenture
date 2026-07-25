import React from "react";
import { NavLink as LinkNav, useNavigate as useNav } from "react-router-dom";
import {
  LayoutDashboard, Brain, MessageSquare, Users, ShoppingBag,
  Search, Briefcase, AlertOctagon, ShieldAlert, Bell, Settings,
  LogOut, ExternalLink, ShieldCheck, Share2
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../lib/utils";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  badge?: number;
}

function Sidebar() {
  const navigate = useNav();
  const { user, isAdmin, logout } = useAuth();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const initials = getInitials(displayName);
  const displayEmail = user?.email || "";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems: NavItem[] = [
    { path: "/",          label: "Dashboard",         icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: "/civic-eye", label: "CivicEye AI",        icon: <Brain className="w-5 h-5 text-indigo-500" /> },
    { path: "/feed",      label: "Community Feed",     icon: <MessageSquare className="w-5 h-5 text-blue-500" /> },
    { path: "/community", label: "Communities",        icon: <Users className="w-5 h-5 text-emerald-500" /> },
    { path: "/marketplace",label: "Marketplace",      icon: <ShoppingBag className="w-5 h-5 text-orange-500" /> },
    { path: "/lost-found", label: "Lost & Found",      icon: <Search className="w-5 h-5 text-cyan-500" /> },
    { path: "/jobs",      label: "Local Jobs",         icon: <Briefcase className="w-5 h-5 text-amber-500" /> },
    { path: "/sos",       label: "Emergency SOS",      icon: <AlertOctagon className="w-5 h-5 text-red-500" /> },
    { path: "/admin",     label: "Admin Panel",        icon: <ShieldAlert className="w-5 h-5 text-[#2563eb]" />, adminOnly: true },
  ];

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside
      className="h-screen w-[240px] flex flex-col fixed left-0 top-0 z-50 border-r transition-colors duration-300"
      style={{
        background: "var(--bg-sidebar)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex flex-col h-full py-5 gap-3 px-3">

        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <div className="px-2 mb-2 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1d4ed8] to-[#6366f1] flex items-center justify-center text-white shadow-md shadow-blue-200 flex-shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[16px] font-extrabold text-[#2563eb] leading-tight tracking-tight">
              CiviLink AI
            </h1>
            <p className="text-[9px] uppercase tracking-[0.12em] font-bold text-[#94a3b8]">
              Smart Community
            </p>
          </div>
        </div>

        {/* ── Admin Role Badge ──────────────────────────────────────────── */}
        {isAdmin && (
          <div className="mx-1 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
              Admin Mode
            </span>
          </div>
        )}

        {/* ── Navigation Links ──────────────────────────────────────────── */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto custom-scrollbar pr-1">
          {visibleItems.map((item) => (
            <LinkNav
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                  isActive
                    ? "bg-[#eff6ff] dark:bg-blue-900/25 text-[#2563eb] font-semibold"
                    : "text-[#475569] dark:text-slate-400 hover:text-[#0f1f3d] dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#2563eb] rounded-full" />
                  )}
                  <span className={`transition-transform duration-150 group-hover:scale-110 shrink-0 ${isActive ? "text-[#2563eb]" : ""}`}>
                    {item.icon}
                  </span>
                  <span className="text-[13px] font-[550] leading-none flex-1">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 bg-[#2563eb] text-white text-[9px] font-bold rounded-full min-w-[18px] text-center">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </>
              )}
            </LinkNav>
          ))}
        </nav>

        {/* ── Footer: Settings + Notifications + Profile ────────────────── */}
        <div className="border-t pt-2 space-y-0.5" style={{ borderColor: "var(--border-color)" }}>

          <LinkNav
            to="/notifications"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                isActive
                  ? "text-[#2563eb] font-semibold bg-[#eff6ff] dark:bg-blue-900/25"
                  : "text-[#475569] dark:text-slate-400 hover:text-[#0f1f3d] dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
              }`
            }
          >
            <Bell className="w-5 h-5 text-[#94a3b8]" />
            <span className="text-[13px] font-[550] flex-1">Notifications</span>
          </LinkNav>

          <LinkNav
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                isActive
                  ? "text-[#2563eb] font-semibold bg-[#eff6ff] dark:bg-blue-900/25"
                  : "text-[#475569] dark:text-slate-400 hover:text-[#0f1f3d] dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
              }`
            }
          >
            <Settings className="w-5 h-5 text-[#94a3b8]" />
            <span className="text-[13px] font-[550]">Settings</span>
          </LinkNav>

          {/* Profile Card */}
          <LinkNav
            to="/profile"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all group mt-1"
          >
            <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden shadow-sm">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#2563eb] to-[#6366f1] flex items-center justify-center text-white font-bold text-xs">
                  {initials}
                </div>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[12px] font-semibold text-[#0f1f3d] dark:text-slate-200 truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-[#94a3b8] truncate">{displayEmail}</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#94a3b8] group-hover:text-[#2563eb] transition-colors" />
          </LinkNav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all text-[13px] font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
