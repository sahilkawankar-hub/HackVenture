import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Moon, Sun, Plus, Bell } from "lucide-react";

/**
 * Top navigation bar — CiviLink AI premium design.
 * Search, dark mode toggle, notifications, and New Request CTA.
 */
function Navbar() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("civilink_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("civilink_theme", "light");
    }
  }, [isDark]);

  // Initialize theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("civilink_theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/feed?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className="h-14 w-full sticky top-0 z-40 px-6 flex items-center justify-between gap-4 transition-colors duration-300"
      style={{
        background: "rgba(var(--bg-sidebar-rgb, 248, 250, 255), 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-color)",
        backgroundColor: "color-mix(in srgb, var(--bg-sidebar) 85%, transparent)",
      }}
    >
      {/* ── Search ──────────────────────────────────────────────────────── */}
      <form onSubmit={handleSearch} className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
        <input
          ref={searchRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search community, items, or news..."
          className="w-full pl-10 pr-4 py-2 rounded-full text-[13px] transition-all outline-none"
          style={{
            background: "var(--bg-input)",
            border: "1.5px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--border-focus)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-color)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </form>

      {/* ── Right Actions ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 flex-shrink-0">

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDark((d) => !d)}
          aria-label="Toggle dark mode"
          className="p-2 rounded-full transition-all hover:bg-slate-100 dark:hover:bg-slate-800 text-[#475569] dark:text-slate-400"
        >
          {isDark
            ? <Sun className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            : <Moon className="w-[18px] h-[18px]" />
          }
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          aria-label="Notifications"
          className="p-2 rounded-full transition-all hover:bg-slate-100 dark:hover:bg-slate-800 relative text-[#475569] dark:text-slate-400"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-[#e2e8f0] dark:bg-slate-700 mx-1" />

        {/* New Request CTA */}
        <button
          id="new-request-btn"
          onClick={() => navigate("/civic-eye")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-[13px] text-white transition-all active:scale-95 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
            boxShadow: "0 2px 12px rgba(37,99,235,0.35)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(37,99,235,0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 12px rgba(37,99,235,0.35)";
          }}
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>
    </header>
  );
}

export default Navbar;
