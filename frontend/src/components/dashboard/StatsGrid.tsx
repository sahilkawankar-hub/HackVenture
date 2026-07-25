import { TrendingUp, CheckCircle2, Zap, Users } from "lucide-react";

interface StatCard {
  id: string;
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: string;
  trendUp?: boolean;
}

const stats: StatCard[] = [
  {
    id: "stat-reports",
    label: "Reports This Month",
    value: "47",
    sub: "in Greenwood Heights",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-[#2563eb]",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    trend: "+12%",
    trendUp: true,
  },
  {
    id: "stat-resolved",
    label: "Issues Resolved",
    value: "38",
    sub: "81% resolution rate",
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    trend: "+8%",
    trendUp: true,
  },
  {
    id: "stat-ai",
    label: "AI Detections",
    value: "124",
    sub: "96.8% accuracy",
    icon: <Zap className="w-5 h-5" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    trend: "Active",
  },
  {
    id: "stat-members",
    label: "Active Members",
    value: "2,341",
    sub: "in your community",
    icon: <Users className="w-5 h-5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    trend: "+34",
    trendUp: true,
  },
];

function StatsGrid() {
  return (
    <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          id={stat.id}
          className="card card-interactive p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color}`}>
              {stat.icon}
            </div>
            {stat.trend && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  stat.trendUp
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {stat.trendUp ? "↑ " : ""}{stat.trend}
              </span>
            )}
          </div>
          <div>
            <p
              className="text-[28px] font-black leading-tight tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {stat.value}
            </p>
            <p className="text-[12px] font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>
              {stat.label}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              {stat.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;
