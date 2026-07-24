import { useNavigate } from "react-router-dom";

/**
 * WelcomeHero — top section of the dashboard.
 * Shows greeting, community location badge, and "Report Issue" quick action.
 */
function WelcomeHero() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      {/* Left — greeting */}
      <div className="space-y-2">
        {/* Location badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#6cf8bb]/20 text-[#006c49] text-xs font-semibold rounded-full w-fit">
          <span
            className="material-symbols-outlined text-[14px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            location_on
          </span>
          Greenwood Heights Community
        </div>

        <h2 className="text-[42px] md:text-[48px] font-bold text-[#0b1c30] leading-[52px] tracking-tight">
          Welcome back, Alex!
        </h2>
        <p className="text-base text-[#434655] max-w-xl leading-relaxed">
          Everything is running smoothly in your neighborhood today. Here is
          what happened while you were away.
        </p>
      </div>

      {/* Right — Report Issue CTA */}
      <button
        id="report-issue-btn"
        onClick={() => navigate("/civic-eye")}
        className="flex items-center gap-3 bg-white border border-[#c3c6d7] px-5 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all group flex-shrink-0"
      >
        <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined">report_problem</span>
        </div>
        <div className="text-left">
          <p className="text-[15px] font-semibold text-[#0b1c30] leading-tight">
            Report Issue
          </p>
          <p className="text-[11px] text-[#434655] mt-0.5">
            Potholes, lights, or leaks
          </p>
        </div>
      </button>
    </section>
  );
}

export default WelcomeHero;
