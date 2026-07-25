import React from "react";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  size = "md",
}) => {
  const sizes = {
    sm: { icon: "w-10 h-10 text-2xl", title: "text-sm font-semibold", desc: "text-xs", padding: "py-8 px-6" },
    md: { icon: "w-16 h-16 text-3xl", title: "text-base font-semibold", desc: "text-sm", padding: "py-12 px-8" },
    lg: { icon: "w-20 h-20 text-4xl", title: "text-lg font-bold", desc: "text-sm", padding: "py-16 px-10" },
  };
  const s = sizes[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        s.padding,
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "rounded-2xl bg-[#eff6ff] dark:bg-blue-900/20 flex items-center justify-center mb-4 text-[#2563eb] dark:text-blue-400",
            s.icon
          )}
        >
          {icon}
        </div>
      )}
      <p className={cn("text-[#0f1f3d] dark:text-slate-200 mb-1", s.title)}>{title}</p>
      {description && (
        <p className={cn("text-[#475569] dark:text-slate-400 max-w-xs leading-relaxed mb-5", s.desc)}>
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-sm shadow-blue-200"
        >
          {action.icon}
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
