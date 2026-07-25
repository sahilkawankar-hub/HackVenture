import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  showHomeButton = false,
  className,
}) => {
  const navigate = useNavigate();
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className ?? ""}`}>
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <p className="text-base font-semibold text-[#0f1f3d] dark:text-slate-200 mb-1">{title}</p>
      <p className="text-sm text-[#475569] dark:text-slate-400 max-w-xs leading-relaxed mb-6">{description}</p>
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
        {showHomeButton && (
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#e2e8f0] dark:border-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-[#475569] dark:text-slate-300"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
