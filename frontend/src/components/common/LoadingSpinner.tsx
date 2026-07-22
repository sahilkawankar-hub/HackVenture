/**
 * Reusable loading spinner component.
 */

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeMap = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeMap[size]} border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin`}
      />
    </div>
  );
}

export default LoadingSpinner;
