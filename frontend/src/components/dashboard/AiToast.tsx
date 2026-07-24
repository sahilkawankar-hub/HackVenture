import { useEffect, useState } from "react";

/**
 * AiToast — sliding bottom-right notification that appears after 3 s.
 * Dismissible. No backend dependency.
 */
function AiToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      id="ai-toast"
      className="fixed bottom-6 right-6 bg-[#213145] text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 max-w-sm border border-white/10 animate-slide-up"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-[#004ac6] flex items-center justify-center flex-shrink-0">
        <span
          className="material-symbols-outlined text-[20px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          psychology
        </span>
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className="text-[14px] font-semibold leading-tight">AI Insights Ready</p>
        <p className="text-[11px] opacity-75 mt-0.5">
          3 new efficiency tips for your home.
        </p>
      </div>

      {/* Close */}
      <button
        id="ai-toast-close"
        onClick={() => setVisible(false)}
        aria-label="Dismiss notification"
        className="text-[#737686] hover:text-white transition-colors ml-1 flex-shrink-0"
      >
        <span className="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>
  );
}

export default AiToast;
