import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface NavItem {
  path: string;
  label: string;
  icon: string;
  iconColor?: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { path: "/", label: "Dashboard", icon: "dashboard" },
  { path: "/civic-eye", label: "CivicEye AI", icon: "psychology", iconColor: "text-[#3e3fcc]" },
  { path: "/feed", label: "Community Feed", icon: "forum" },
  { path: "/marketplace", label: "Marketplace", icon: "storefront" },
  { path: "/lost-found", label: "Lost & Found", icon: "search_check" },
  { path: "/jobs", label: "Local Jobs", icon: "work" },
  { path: "/sos", label: "Emergency SOS", icon: "emergency", iconColor: "text-red-500" },
  { path: "/admin", label: "Admin Panel", icon: "admin_panel_settings", iconColor: "text-[#004ac6]", adminOnly: true },
];

function Sidebar() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  // Derive display name and initials from Supabase user
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const displayEmail = user?.email || "";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Filter nav items based on role
  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className="h-screen w-64 flex flex-col fixed left-0 top-0 bg-[#eff4ff] shadow-sm z-50 border-r border-[#c3c6d7]/40">
      <div className="flex flex-col h-full py-6 gap-4 px-4">
        {/* Logo */}
        <div className="px-2 mb-4 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#004ac6] flex items-center justify-center text-white shadow-md">
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              hub
            </span>
          </div>
          <div>
            <h1 className="text-[18px] font-bold text-[#004ac6] leading-tight tracking-tight">
              CiviLink AI
            </h1>
            <p className="text-[9px] uppercase tracking-widest font-bold text-[#434655]/60">
              Smart Community
            </p>
          </div>
        </div>

        {/* Role Badge */}
        {isAdmin && (
          <div className="mx-2 px-3 py-2 bg-purple-100 border border-purple-200 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_person
            </span>
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Admin Mode</span>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-150 active:scale-[0.98] ${
                  isActive
                    ? "text-[#004ac6] font-bold border-r-2 border-[#004ac6] bg-[#004ac6]/10 shadow-sm"
                    : "text-[#434655] hover:text-[#0b1c30] hover:bg-[#d3e4fe]/50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      isActive ? "text-[#004ac6]" : (item.iconColor ?? "text-[#434655]")
                    }`}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[14px] font-[560] leading-none">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer: Settings, Profile & Logout */}
        <div className="mt-auto border-t border-[#c3c6d7]/30 pt-3 space-y-2">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-2.5 rounded-2xl transition-all duration-150 ${
                isActive
                  ? "text-[#004ac6] font-bold bg-[#004ac6]/10"
                  : "text-[#434655] hover:text-[#0b1c30] hover:bg-[#d3e4fe]/50"
              }`
            }
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
            <span className="text-[14px] font-[560]">Settings</span>
          </NavLink>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 px-3 py-2.5 bg-[#e5eeff] rounded-2xl">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#004ac6] to-[#3e3fcc] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[13px] font-semibold text-[#0b1c30] truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-[#434655] truncate">
                {displayEmail}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-2xl transition-all text-[13px] font-semibold"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
