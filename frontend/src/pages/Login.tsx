import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../context/AuthContext";

type AuthMode = "login" | "signup";

/**
 * Login page — CiviLink AI
 *
 * Features:
 *  - Portal toggle: User Portal vs Admin Portal
 *  - Quick Demo Access (One-click dashboard preview)
 *  - Google OAuth via Supabase
 *  - Email + Password sign-in / sign-up via Supabase Auth
 *  - Auto-redirect if authenticated
 */
function Login() {
  const navigate = useNavigate();
  const {
    loginWithGoogle,
    loginWithEmail,
    signUpWithEmail,
    loginAsDemo,
    isAuthenticated,
    role,
    setRole,
    loading,
  } = useAuth();

  const [portal, setPortal] = useState<UserRole>(role);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(role === "admin" ? "/admin" : "/", { replace: true });
    }
  }, [loading, isAuthenticated, role, navigate]);

  const handlePortalSwitch = (newPortal: UserRole) => {
    setPortal(newPortal);
    setRole(newPortal);
    setError(null);
    setSuccessMsg(null);
  };

  const handleDemoAccess = () => {
    loginAsDemo(portal);
    navigate(portal === "admin" ? "/admin" : "/", { replace: true });
  };

  /* ── Google OAuth ──────────────────────────────────────────────────── */
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed. Check Supabase Auth settings.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  /* ── Email / Password ──────────────────────────────────────────────── */
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setIsEmailLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
        navigate(portal === "admin" ? "/admin" : "/", { replace: true });
      } else {
        await signUpWithEmail(email, password);
        setSuccessMsg(
          "Account created! Check your email for a confirmation link, then sign in."
        );
        setMode("login");
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please try again.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#004ac6]/20 border-t-[#004ac6] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-stretch">
      {/* ── Left panel — branding ───────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#004ac6] via-[#2563eb] to-[#3e3fcc] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#3e3fcc]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              hub
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">CiviLink AI</h1>
            <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold">
              Smart Community
            </p>
          </div>
        </div>

        {/* Centre hero content */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full">
            <span
              className="material-symbols-outlined text-white text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              psychology
            </span>
            <span className="text-white/90 text-xs font-semibold">
              AI-Powered Civic Intelligence
            </span>
          </div>

          <h2 className="text-[40px] font-bold text-white leading-tight tracking-tight">
            Your neighborhood,<br />
            <span className="text-white/70">smarter than ever.</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-sm">
            Report issues, connect with neighbors, browse the local marketplace,
            and let AI prioritize your community's needs — all in one place.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { icon: "camera_alt", label: "CivicEye AI" },
              { icon: "forum", label: "Community Feed" },
              { icon: "storefront", label: "Marketplace" },
              { icon: "search_check", label: "Lost & Found" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full border border-white/15"
              >
                <span className="material-symbols-outlined text-white/80 text-[14px]">
                  {f.icon}
                </span>
                <span className="text-white/80 text-[11px] font-semibold">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white/40 text-xs">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          Secured by Supabase Auth &amp; PostgreSQL RLS
        </div>
      </div>

      {/* ── Right panel — auth form ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[420px] space-y-5">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#004ac6] flex items-center justify-center">
              <span
                className="material-symbols-outlined text-white text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                hub
              </span>
            </div>
            <h1 className="text-lg font-bold text-[#004ac6]">CiviLink AI</h1>
          </div>

          {/* ── Portal Toggle (User / Admin) ────────────────────────────── */}
          <div className="bg-[#e5eeff] p-1.5 rounded-2xl flex gap-1.5">
            <button
              onClick={() => handlePortalSwitch("user")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold transition-all ${
                portal === "user"
                  ? "bg-white text-[#004ac6] shadow-md"
                  : "text-[#434655] hover:text-[#0b1c30]"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={portal === "user" ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                person
              </span>
              User Portal
            </button>
            <button
              onClick={() => handlePortalSwitch("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold transition-all ${
                portal === "admin"
                  ? "bg-white text-[#004ac6] shadow-md"
                  : "text-[#434655] hover:text-[#0b1c30]"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={portal === "admin" ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                admin_panel_settings
              </span>
              Admin Panel
            </button>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-[26px] font-bold text-[#0b1c30] tracking-tight">
              {mode === "login"
                ? portal === "admin"
                  ? "Admin Sign In"
                  : "Welcome back"
                : "Create account"}
            </h2>
            <p className="text-[13px] text-[#434655] mt-0.5">
              {mode === "login"
                ? portal === "admin"
                  ? "Sign in to access the admin & moderation dashboard."
                  : "Sign in to your community dashboard."
                : "Join your neighborhood on CiviLink AI."}
            </p>
          </div>

          {/* ── DEMO INSTANT ACCESS BUTTON ─────────────────────────────── */}
          <button
            type="button"
            onClick={handleDemoAccess}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-[13px] font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-emerald-400/30"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            Explore Demo {portal === "admin" ? "Admin Panel" : "Dashboard"} (Instant Access)
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
            <div className="flex-1 h-px bg-[#c3c6d7]" />
            <span className="text-[11px] text-[#737686] font-semibold uppercase tracking-wider">
              Or sign in with credentials
            </span>
            <div className="flex-1 h-px bg-[#c3c6d7]" />
          </div>

          {/* ── Error / Success banners ─────────────────────────────────── */}
          {error && (
            <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-2xl">
              <span className="material-symbols-outlined text-red-500 text-[18px] flex-shrink-0">
                error
              </span>
              <p className="text-[12px] text-red-700">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="material-symbols-outlined text-emerald-500 text-[18px] flex-shrink-0">
                check_circle
              </span>
              <p className="text-[12px] text-emerald-700">{successMsg}</p>
            </div>
          )}

          {/* ── Google OAuth button ─────────────────────────────────────── */}
          <button
            id="google-signin-btn"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-[#c3c6d7] rounded-2xl text-[13px] font-semibold text-[#0b1c30] hover:bg-[#f8f9ff] hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isGoogleLoading ? (
              <span className="w-4 h-4 border-2 border-[#004ac6]/30 border-t-[#004ac6] rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* ── Email / Password form ───────────────────────────────────── */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-[12px] font-semibold text-[#0b1c30]">
                Email address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686] text-[18px]">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder={portal === "admin" ? "admin@civilink.ai" : "you@example.com"}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#c3c6d7] rounded-2xl text-[13px] text-[#0b1c30] placeholder:text-[#737686] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/25 focus:border-[#004ac6] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[12px] font-semibold text-[#0b1c30]">
                  Password
                </label>
                {mode === "login" && (
                  <button type="button" className="text-[11px] text-[#004ac6] hover:underline font-semibold">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686] text-[18px]">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder={mode === "signup" ? "Min. 6 characters" : "Enter your password"}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-[#c3c6d7] rounded-2xl text-[13px] text-[#0b1c30] placeholder:text-[#737686] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/25 focus:border-[#004ac6] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#0b1c30] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="email-auth-btn"
              type="submit"
              disabled={isEmailLoading}
              className={`w-full py-3 font-bold text-[13px] rounded-2xl transition-all active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                portal === "admin"
                  ? "bg-gradient-to-r from-purple-700 to-[#3e3fcc] text-white"
                  : "bg-[#004ac6] hover:bg-[#2563eb] text-white"
              }`}
            >
              {isEmailLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">
                  {mode === "login"
                    ? portal === "admin" ? "admin_panel_settings" : "login"
                    : "person_add"}
                </span>
              )}
              {mode === "login"
                ? portal === "admin" ? "Sign In as Admin" : "Sign In with Email"
                : "Create Account"}
            </button>
          </form>

          {/* Mode toggle */}
          <p className="text-center text-[12px] text-[#434655]">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  id="switch-to-signup-btn"
                  onClick={() => { setMode("signup"); setError(null); setSuccessMsg(null); }}
                  className="text-[#004ac6] font-bold hover:underline"
                >
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  id="switch-to-login-btn"
                  onClick={() => { setMode("login"); setError(null); setSuccessMsg(null); }}
                  className="text-[#004ac6] font-bold hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
