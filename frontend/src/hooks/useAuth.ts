import { supabase } from "../lib/supabase";
import { useAuthContext, UserRole } from "../context/AuthContext";

/**
 * Custom hook for Supabase authentication operations.
 */
export function useAuth() {
  const { user, session, loading, token, role, setRole, isDemo, loginAsDemo } = useAuthContext();

  /**
   * Trigger Google OAuth sign-in via Supabase Auth
   */
  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
    return data;
  };

  /**
   * Sign in with email and password via Supabase Auth
   */
  const loginWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  /**
   * Sign up with email and password via Supabase Auth
   */
  const signUpWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  /**
   * Sign out user from Supabase session
   */
  const logout = async () => {
    localStorage.removeItem("civilink_demo");
    localStorage.removeItem("civilink_role");
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore if supabase is not connected
    }
  };

  return {
    user,
    session,
    loading,
    token,
    role,
    setRole,
    isDemo,
    loginAsDemo,
    isAuthenticated: !!user,
    isAdmin: role === "admin",
    loginWithGoogle,
    loginWithEmail,
    signUpWithEmail,
    logout,
  };
}
