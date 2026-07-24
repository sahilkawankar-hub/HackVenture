import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

type AuthMode = "login" | "signup";

/**
 * Login page — CiviLink AI Stitch design.
 *
 * Supports:
 *  - Google OAuth via Supabase (existing useAuth hook)
 *  - Email + Password sign-in / sign-up via Supabase Auth
 *
 * Detects placeholder Supabase config and shows a setup banner.
 */
function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  /* ── Placeholder config detection ─────────────────────────────────── */
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
  const isPlaceholderConfig =
    !supabaseUrl ||
    supabaseUrl.includes("your-project") ||
    supabaseUrl.includes("xyzcompany");

  /* ── Google OAuth ──────────────────────────────────────────────────── */
  const handleGoogleLogin = async () => {
    if (isPlaceholderConfig) {
      setError(
        "Supabase is not configured. Update VITE_SUPABASE_URL in frontend/.env"
      );
      return;
    }
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
    setIsEmailLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccessMsg(
          "Account created! Check your email for a confirmation link."
        );
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please try again.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-stretch">
      {/* ── Left panel — branding ───────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#004ac6] via-[#2563eb] to-[#3e3fcc] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative blobs */}
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
          {/* AI shimmer badge */}
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

          {/* Feature chips */}
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

        {/* Bottom footnote */}
        <div className="relative z-10 flex items-center gap-2 text-white/40 text-xs">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          Secured by Supabase Auth &amp; PostgreSQL RLS
        </div>
      </div>

      {/* ── Right panel — auth form ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px] space-y-7">

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

          {/* Header */}
          <div>
            <h2 className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-[14px] text-[#434655] mt-1">
              {mode === "login"
                ? "Sign in to your community dashboard."
                : "Join your neighborhood on CiviLink AI."}
            </p>
          </div>

          {/* ── Placeholder config warning ──────────────────────────────── */}
          {isPlaceholderConfig && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="material-symbols-outlined text-amber-500 text-[20px] flex-shrink-0 mt-0.5">
                warning
              </span>
              <div>
                <p className="text-[13px] font-bold text-amber-800">
                  Supabase Setup Needed
                </p>
                <p className="text-[12px] text-amber-700 mt-0.5 leading-relaxed">
                  Update{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">
                    VITE_SUPABASE_URL
                  </code>{" "}
                  and{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">
                    VITE_SUPABASE_ANON_KEY
                  </code>{" "}
                  in <code className="font-mono text-[11px]">frontend/.env</code>
                </p>
              </div>
            </div>
          )}

          {/* ── Error / Success banners ─────────────────────────────────── */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <span className="material-symbols-outlined text-red-500 text-[18px] flex-shrink-0">
                error
              </span>
              <p className="text-[13px] text-red-700">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="material-symbols-outlined text-emerald-500 text-[18px] flex-shrink-0">
                check_circle
              </span>
              <p className="text-[13px] text-emerald-700">{successMsg}</p>
            </div>
          )}

          {/* ── Google OAuth button ─────────────────────────────────────── */}
          <button
            id="google-signin-btn"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-[#c3c6d7] rounded-2xl text-[14px] font-semibold text-[#0b1c30] hover:bg-[#f8f9ff] hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isGoogleLoading ? (
              <span className="w-5 h-5 border-2 border-[#004ac6]/30 border-t-[#004ac6] rounded-full animate-spin" />
            ) : (
              /* Google logo SVG */
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[#c3c6d7]" />
            <span className="text-[12px] text-[#737686] font-medium">or</span>
            <div className="flex-1 h-px bg-[#c3c6d7]" />
          </div>

          {/* ── Email / Password form ───────────────────────────────────── */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-[13px] font-semibold text-[#0b1c30]"
              >
                Email address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737686] text-[18px]">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#c3c6d7] rounded-2xl text-[14px] text-[#0b1c30] placeholder:text-[#737686] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/25 focus:border-[#004ac6] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-[13px] font-semibold text-[#0b1c30]"
                >
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    className="text-[12px] text-[#004ac6] hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737686] text-[18px]">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder={mode === "signup" ? "Min. 8 characters" : "Enter your password"}
                  className="w-full pl-11 pr-12 py-3.5 bg-white border border-[#c3c6d7] rounded-2xl text-[14px] text-[#0b1c30] placeholder:text-[#737686] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/25 focus:border-[#004ac6] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#0b1c30] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
              className="w-full py-3.5 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-[14px] rounded-2xl transition-all active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isEmailLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">
                  {mode === "login" ? "login" : "person_add"}
                </span>
              )}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* ── Mode toggle ─────────────────────────────────────────────── */}
          <p className="text-center text-[13px] text-[#434655]">
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

          {/* ── Terms ───────────────────────────────────────────────────── */}
          <p className="text-center text-[11px] text-[#737686] leading-relaxed">
            By continuing you agree to the{" "}
            <span className="text-[#004ac6] cursor-pointer hover:underline">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-[#004ac6] cursor-pointer hover:underline">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
