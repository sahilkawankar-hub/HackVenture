import { NavLink } from "react-router-dom";

/**
 * Nav item definition for the Stitch-design sidebar.
 */
interface NavItem {
  path: string;
  label: string;
  icon: string;
  iconFilled?: string;
  iconColor?: string;
}

const navItems: NavItem[] = [
  { path: "/", label: "Dashboard", icon: "dashboard" },
  { path: "/civic-eye", label: "CivicEye AI", icon: "psychology", iconColor: "text-[#3e3fcc]" },
  { path: "/feed", label: "Community Feed", icon: "forum" },
  { path: "/marketplace", label: "Marketplace", icon: "storefront" },
  { path: "/lost-found", label: "Lost & Found", icon: "search_check" },
  { path: "/jobs", label: "Local Jobs", icon: "work" },
  { path: "/admin", label: "SOS", icon: "emergency", iconColor: "text-red-500" },
];

/**
 * Sidebar navigation component — Stitch AI design.
 * Uses Material Symbols Outlined icons loaded via index.css.
 */
function Sidebar() {
  return (
    <aside className="h-screen w-64 flex flex-col fixed left-0 top-0 bg-[#eff4ff] shadow-sm z-50 border-r border-[#c3c6d7]/40">
      <div className="flex flex-col h-full py-6 gap-4 px-4">

        {/* ── Logo ─────────────────────────────────────────────────────── */}
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

        {/* ── Nav Links ────────────────────────────────────────────────── */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-150 active:scale-[0.98] ${
                  isActive
                    ? "text-[#004ac6] font-bold border-r-2 border-[#004ac6] bg-[#004ac6]/5"
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
                    style={
                      isActive
                        ? { fontVariationSettings: "'FILL' 1" }
                        : undefined
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="text-[15px] font-[560] leading-none">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="mt-auto border-t border-[#c3c6d7]/30 pt-4">
          <NavLink
            to="/admin"
            className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-150 text-[#434655] hover:text-[#0b1c30] hover:bg-[#d3e4fe]/50"
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
            <span className="text-[15px] font-[560]">Settings</span>
          </NavLink>

          {/* User profile card */}
          <div className="flex items-center gap-3 px-4 py-3 mt-1 bg-[#e5eeff] rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004ac6] to-[#3e3fcc] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              AJ
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[14px] font-semibold text-[#0b1c30] truncate">
                Alex Johnson
              </p>
              <p className="text-[11px] text-[#434655] truncate">
                Resident · Level 4
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
