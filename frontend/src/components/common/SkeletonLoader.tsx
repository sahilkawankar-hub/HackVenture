import React from "react";
import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, style }) => (
  <div className={cn("skeleton animate-skeleton-pulse", className)} style={style} />
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn("h-4 rounded-md", i === lines - 1 ? "w-3/4" : "w-full")}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("card p-5 space-y-4", className)}>
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3 rounded-md" />
        <Skeleton className="h-3 w-1/4 rounded-md" />
      </div>
    </div>
    <Skeleton className="h-4 w-full rounded-md" />
    <Skeleton className="h-4 w-5/6 rounded-md" />
    <Skeleton className="h-4 w-4/6 rounded-md" />
  </div>
);

export const SkeletonIssueCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("card p-5 space-y-3", className)}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-24 rounded-full" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <Skeleton className="h-5 w-3/4 rounded-md" />
    <div className="flex gap-4">
      <Skeleton className="h-4 w-24 rounded-md" />
      <Skeleton className="h-4 w-20 rounded-md" />
    </div>
  </div>
);

export const SkeletonTableRow: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <tr className="border-b border-slate-100 dark:border-slate-800">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4 rounded-md" style={{ width: `${60 + Math.random() * 40}%` }} />
      </td>
    ))}
  </tr>
);

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-end">
      <div className="space-y-3">
        <Skeleton className="h-4 w-36 rounded-full" />
        <Skeleton className="h-12 w-72 rounded-xl" />
        <Skeleton className="h-4 w-80 rounded-md" />
      </div>
      <Skeleton className="h-14 w-40 rounded-2xl" />
    </div>
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-2xl" />
      ))}
    </div>
    <div className="grid grid-cols-12 gap-5">
      <Skeleton className="col-span-8 h-64 rounded-2xl" />
      <Skeleton className="col-span-4 h-64 rounded-2xl" />
    </div>
  </div>
);
