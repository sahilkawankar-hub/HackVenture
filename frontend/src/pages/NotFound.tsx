import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9ff] text-[#0b1c30] p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Illustration */}
        <div className="relative mx-auto w-40 h-40">
          <div className="absolute inset-0 bg-[#004ac6]/10 rounded-full animate-pulse" />
          <div className="absolute inset-4 bg-[#004ac6]/15 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-16 h-16 text-[#004ac6]/40" />
          </div>
        </div>

        {/* Error text */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-[#004ac6]">Error 404</p>
          <h1 className="text-5xl font-black text-[#0b1c30] tracking-tight">Page Not Found</h1>
          <p className="text-sm text-[#434655] leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            Head back to the dashboard to continue.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#004ac6] text-white font-bold rounded-2xl hover:bg-[#2563eb] shadow-md hover:shadow-lg transition-all active:scale-95 text-sm"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0b1c30] font-semibold rounded-2xl border border-[#c3c6d7] hover:bg-[#e5eeff] transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
