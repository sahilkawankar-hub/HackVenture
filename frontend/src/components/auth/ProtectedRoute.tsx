import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * Protected route wrapper — redirects to /login if not authenticated.
 * Shows a loading spinner while Supabase session is being fetched.
 */
export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#004ac6]/20 border-t-[#004ac6] rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#434655]">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

/**
 * Admin-only route wrapper — redirects to / if user is not admin.
 */
export function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#004ac6]/20 border-t-[#004ac6] rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#434655]">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
