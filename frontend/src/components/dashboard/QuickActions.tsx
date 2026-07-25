import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, MessageSquare, ShoppingBag, Briefcase, Search, AlertOctagon } from "lucide-react";

interface QuickActionItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
  color: string;
  path: string;
}

const actions: QuickActionItem[] = [
  {
    id: "quick-report",
    icon: <AlertTriangle className="w-6 h-6" />,
    label: "Report Issue",
    sub: "AI-powered detection",
    color: "from-[#1d4ed8] to-[#3b82f6]",
    path: "/civic-eye",
  },
  {
    id: "quick-community",
    icon: <MessageSquare className="w-6 h-6" />,
    label: "Community Post",
    sub: "Share with neighbors",
    color: "from-[#7c3aed] to-[#8b5cf6]",
    path: "/feed",
  },
  {
    id: "quick-marketplace",
    icon: <ShoppingBag className="w-6 h-6" />,
    label: "Sell Item",
    sub: "List in Marketplace",
    color: "from-[#059669] to-[#10b981]",
    path: "/marketplace",
  },
  {
    id: "quick-job",
    icon: <Briefcase className="w-6 h-6" />,
    label: "Post a Job",
    sub: "Hire locally",
    color: "from-[#d97706] to-[#f59e0b]",
    path: "/jobs",
  },
  {
    id: "quick-lost",
    icon: <Search className="w-6 h-6" />,
    label: "Lost Item",
    sub: "AI matching",
    color: "from-[#0891b2] to-[#06b6d4]",
    path: "/lost-found",
  },
  {
    id: "quick-sos",
    icon: <AlertOctagon className="w-6 h-6" />,
    label: "Emergency SOS",
    sub: "One-tap alert",
    color: "from-[#dc2626] to-[#ef4444]",
    path: "/sos",
  },
];

function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="col-span-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Quick Actions</h3>
        <span className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>
          Everything you need in one tap
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            id={action.id}
            onClick={() => navigate(action.path)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${action.color} text-white transition-all hover:scale-105 hover:shadow-lg active:scale-95 group cursor-pointer`}
          >
            <div className="group-hover:scale-110 transition-transform">
              {action.icon}
            </div>
            <div className="text-center">
              <p className="text-[12px] font-bold leading-tight">{action.label}</p>
              <p className="text-[10px] opacity-80 leading-tight mt-0.5">{action.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
