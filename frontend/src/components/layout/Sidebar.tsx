import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/", label: "Home", icon: "🏠" },
  { path: "/feed", label: "Feed", icon: "📰" },
  { path: "/civic-eye", label: "CivicEye", icon: "👁️" },
  { path: "/lost-found", label: "Lost & Found", icon: "🔍" },
  { path: "/marketplace", label: "Marketplace", icon: "🛒" },
  { path: "/jobs", label: "Jobs", icon: "💼" },
  { path: "/admin", label: "Admin", icon: "⚙️" },
];

/**
 * Sidebar navigation component.
 */
function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          NeighborLink AI
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
