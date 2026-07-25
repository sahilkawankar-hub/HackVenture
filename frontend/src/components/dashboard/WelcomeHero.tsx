import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { MapPin, CloudSun, Heart, AlertTriangle, AlertOctagon } from "lucide-react";

function WelcomeHero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Resident";

  const firstName = displayName.split(" ")[0];

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Left — greeting */}
      <div className="space-y-2">
        {/* Location + community health badge row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold rounded-full border border-emerald-100 dark:border-emerald-800">
            <MapPin className="w-3 h-3" />
            Greenwood Heights
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#2563eb] dark:text-blue-400 text-[11px] font-bold rounded-full border border-blue-100 dark:border-blue-800">
            <Heart className="w-3 h-3 fill-current" />
            Community Health: 92/100
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-[11px] font-bold rounded-full border border-amber-100 dark:border-amber-800">
            <CloudSun className="w-3 h-3" />
            28°C · Partly Cloudy
          </div>
        </div>

        <h2 className="text-[36px] md:text-[42px] font-extrabold leading-tight tracking-tight"
          style={{ color: "var(--text-primary)" }}>
          {getGreeting()}, {firstName}! 👋
        </h2>
        <p className="text-[15px] leading-relaxed max-w-xl" style={{ color: "var(--text-secondary)" }}>
          Your neighborhood is active today — 3 new civic reports, 12 community posts, and 5 nearby job listings.
        </p>
      </div>

      {/* Right — Quick actions */}
      <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
        <button
          id="report-issue-btn"
          onClick={() => navigate("/civic-eye")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95 shadow-md"
          style={{
            background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
            boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
          }}
        >
          <AlertTriangle className="w-4 h-4" />
          Report Issue
        </button>
        <button
          onClick={() => navigate("/sos")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 transition-all hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95"
        >
          <AlertOctagon className="w-4 h-4 text-red-600" />
          Emergency
        </button>
      </div>
    </section>
  );
}

export default WelcomeHero;
