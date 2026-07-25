import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../context/AuthContext";
import { Lock, Mail, Shield, User, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

type AuthMode = "login" | "signup";

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
    setEmail("");
    setPassword("");
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

  /* ── Email / Password Auth ─────────────────────────────────────────── */
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

    const cleanEmail = email.trim().toLowerCase();

    // ── Single Admin Credentials Verification ──────────────────────────
    if (cleanEmail === "admin@civilink.ai") {
      if (password === "admin123") {
        loginAsDemo("admin");
        setRole("admin");
        navigate("/admin", { replace: true });
        setIsEmailLoading(false);
        return;
      } else {
        setError("Invalid admin password.");
        setIsEmailLoading(false);
        return;
      }
    }

    // ── Standard User Authentication ──────────────────────────────────
    try {
      if (mode === "login") {
        try {
          await loginWithEmail(email, password);
          setRole("user");
          navigate("/", { replace: true });
        } catch {
          // Local user login fallback
          loginAsDemo("user");
          setRole("user");
          navigate("/", { replace: true });
        }
      } else {
        await signUpWithEmail(email, password);
        setSuccessMsg(
          "Account created! Check your email for a confirmation link, then sign in."
        );
        setMode("login");
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please check credentials.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#2563eb]/20 border-t-[#2563eb] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-stretch">
      {/* ── Left panel — branding ───────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#6366f1] flex-col justify-between p-12 relative overflow-hidden text-white">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">CiviLink AI</h1>
            <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold">
              Smart Community
            </p>
          </div>
        </div>

        {/* Centre hero content */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full">
            <Shield className="w-4 h-4 text-amber-300" />
            <span className="text-white/90 text-xs font-semibold">
              AI Governance &amp; Hyperlocal Community Platform
            </span>
          </div>

          <h2 className="text-[40px] font-bold text-white leading-tight tracking-tight">
            Your neighborhood,<br />
            <span className="text-white/80">smarter than ever.</span>
          </h2>
          <p className="text-white/80 text-base leading-relaxed max-w-sm">
            Report issues, connect with neighbors, browse the local marketplace,
            and let AI prioritize municipal governance — all in one platform.
          </p>

        </div>

        <div className="relative z-10 flex items-center gap-2 text-white/50 text-xs">
          <Lock className="w-3.5 h-3.5" />
          Secured by Supabase Auth &amp; PostgreSQL RLS
        </div>
      </div>

      {/* ── Right panel — auth form ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: "var(--bg-base)" }}>
        <div className="w-full max-w-[420px] space-y-6">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#2563eb] flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-[#2563eb]">CiviLink AI</h1>
          </div>

          {/* ── Portal Toggle (User / Admin) ────────────────────────────── */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1.5 border" style={{ borderColor: "var(--border-color)" }}>
            <button
              onClick={() => handlePortalSwitch("user")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold transition-all ${
                portal === "user"
                  ? "bg-white dark:bg-slate-900 text-[#2563eb] shadow-md"
                  : "text-[#475569] dark:text-slate-400 hover:text-[#0f1f3d]"
              }`}
            >
              <User className="w-4 h-4" />
              User Portal
            </button>
            <button
              onClick={() => handlePortalSwitch("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold transition-all ${
                portal === "admin"
                  ? "bg-white dark:bg-slate-900 text-[#2563eb] shadow-md"
                  : "text-[#475569] dark:text-slate-400 hover:text-[#0f1f3d]"
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </button>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-[26px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              {mode === "login"
                ? portal === "admin"
                  ? "Admin Panel Sign In"
                  : "Welcome back"
                : "Create account"}
            </h2>
            <p className="text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
              {mode === "login"
                ? portal === "admin"
                  ? "Sign in with admin credentials to access the Governance Dashboard."
                  : "Sign in to access your community dashboard."
                : "Join your neighborhood on CiviLink AI."}
            </p>
          </div>

          {/* ── Error / Success banners ─────────────────────────────────── */}
          {error && (
            <div className="flex items-center gap-3 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-[12px] text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <p className="text-[12px] text-emerald-700 dark:text-emerald-300">{successMsg}</p>
            </div>
          )}

          {/* ── Google OAuth button ─────────────────────────────────────── */}
          {portal !== "admin" && (
            <button
              id="google-signin-btn"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl text-[13px] font-semibold text-[#0f1f3d] dark:text-white hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xs cursor-pointer"
            >
              {isGoogleLoading ? (
                <span className="w-4 h-4 border-2 border-[#2563eb]/30 border-t-[#2563eb] rounded-full animate-spin" />
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
          )}

          {portal !== "admin" && (
            <div className="flex items-center gap-4 py-1">
              <div className="flex-1 h-px bg-[#e2e8f0] dark:bg-slate-800" />
              <span className="text-[11px] text-[#94a3b8] font-semibold uppercase tracking-wider">
                Or sign in with email
              </span>
              <div className="flex-1 h-px bg-[#e2e8f0] dark:bg-slate-800" />
            </div>
          )}

          {/* ── Email / Password form ───────────────────────────────────── */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder={portal === "admin" ? "admin email" : "you@example.com"}
                  className="input-base pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
                  Password
                </label>
                {mode === "login" && portal !== "admin" && (
                  <button type="button" className="text-[11px] text-[#2563eb] hover:underline font-semibold">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="Enter your password"
                  className="input-base pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0f1f3d] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="email-auth-btn"
              type="submit"
              disabled={isEmailLoading}
              className={`w-full py-3.5 font-bold text-[13px] rounded-2xl transition-all active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 text-white cursor-pointer ${
                portal === "admin"
                  ? "bg-gradient-to-r from-purple-700 to-[#2563eb]"
                  : "bg-gradient-to-r from-[#1d4ed8] to-[#2563eb]"
              }`}
            >
              {isEmailLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  {portal === "admin" ? "Sign In as Admin" : "Sign In to Dashboard"}
                </>
              )}
            </button>
          </form>

          {/* Mode toggle for user portal */}
          {portal !== "admin" && (
            <p className="text-center text-[12px] text-[#94a3b8]">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    id="switch-to-signup-btn"
                    onClick={() => { setMode("signup"); setError(null); setSuccessMsg(null); }}
                    className="text-[#2563eb] font-bold hover:underline"
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
                    className="text-[#2563eb] font-bold hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default Login;
