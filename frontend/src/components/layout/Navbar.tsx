import { useNavigate } from "react-router-dom";
import { useState } from "react";

/**
 * Top navigation bar — Stitch AI design.
 * Search, notifications badge, help, and New Request CTA → /civic-eye.
 */
function Navbar() {
  const navigate = useNavigate();
  const [showNotifDot] = useState(true);

  return (
    <header className="h-16 w-full sticky top-0 z-40 bg-[#f8f9ff]/80 backdrop-blur-md border-b border-[#c3c6d7]/50 px-6 flex items-center justify-between gap-4">
      {/* ── Search ──────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-md">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737686] text-[20px]">
          search
        </span>
        <input
          type="text"
          placeholder="Search for local help, items, or news..."
          className="w-full pl-12 pr-4 py-2 bg-[#e5eeff] border-none rounded-full text-sm text-[#0b1c30] placeholder:text-[#737686] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20 transition-all"
        />
      </div>

      {/* ── Right Actions ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="p-2 rounded-full hover:bg-[#d3e4fe]/50 transition-colors relative"
        >
          <span className="material-symbols-outlined text-[#434655] text-[22px]">
            notifications
          </span>
          {showNotifDot && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f8f9ff]" />
          )}
        </button>

        {/* Help */}
        <button
          aria-label="Help"
          className="p-2 rounded-full hover:bg-[#d3e4fe]/50 transition-colors"
        >
          <span className="material-symbols-outlined text-[#434655] text-[22px]">
            help_outline
          </span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-[#c3c6d7] mx-1" />

        {/* New Request CTA */}
        <button
          id="new-request-btn"
          onClick={() => navigate("/civic-eye")}
          className="bg-[#004ac6] hover:bg-[#2563eb] text-white px-5 py-2 rounded-full font-semibold text-sm transition-all active:scale-95 flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Request
        </button>
      </div>
    </header>
  );
}

export default Navbar;
