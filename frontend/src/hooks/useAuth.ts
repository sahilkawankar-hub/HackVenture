import { supabase } from "../lib/supabase";
import { useAuthContext } from "../context/AuthContext";

/**
 * Custom hook for Supabase authentication operations.
 */
export function useAuth() {
  const { user, session, loading, token } = useAuthContext();

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
   * Sign out user from Supabase session
   */
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    token,
    isAuthenticated: !!user,
    loginWithGoogle,
    logout,
  };
}
