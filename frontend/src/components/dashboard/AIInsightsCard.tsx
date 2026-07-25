import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const insights = [
  {
    id: "ai-insight-1",
    icon: <TrendingUp className="w-4 h-4 text-[#2563eb]" />,
    title: "Road Damage Spike",
    body: "42% increase in pothole reports near Oak St. AI recommends priority inspection.",
    tag: "Roads & Potholes",
    tagColor: "badge-blue",
    path: "/civic-eye",
  },
  {
    id: "ai-insight-2",
    icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
    title: "Water Pressure Alert",
    body: "3 water leak reports filed within 500m radius in the last 24 hours.",
    tag: "Water & Drainage",
    tagColor: "badge-amber",
    path: "/civic-eye",
  },
  {
    id: "ai-insight-3",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    title: "Resolution Milestone",
    body: "Your community crossed 80% resolution rate this month — top 5% nationally.",
    tag: "Achievement",
    tagColor: "badge-green",
    path: "/admin",
  },
];

function AIInsightsCard() {
  const navigate = useNavigate();

  return (
    <div className="col-span-12 lg:col-span-4 card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#eff6ff] to-[#ede9fe]">
            <Sparkles className="w-4 h-4 text-[#2563eb]" />
          </div>
          <div>
            <h3 className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>
              AI Community Insights
            </h3>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              Powered by CivicEye AI
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {insights.map((insight) => (
          <button
            key={insight.id}
            id={insight.id}
            onClick={() => navigate(insight.path)}
            className="w-full text-left p-3.5 rounded-xl border transition-all hover:shadow-sm group"
            style={{
              background: "var(--bg-input)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex-shrink-0 mt-0.5">
                {insight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-[12px] font-bold truncate" style={{ color: "var(--text-primary)" }}>
                    {insight.title}
                  </p>
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-[#94a3b8] group-hover:text-[#2563eb] transition-colors" />
                </div>
                <p className="text-[11px] leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
                  {insight.body}
                </p>
                <span className={`badge ${insight.tagColor}`}>{insight.tag}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default AIInsightsCard;
