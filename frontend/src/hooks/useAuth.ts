import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuthContext } from "../context/AuthContext";

/**
 * Custom hook for authentication operations.
 */
export function useAuth() {
  const { user, loading, token } = useAuthContext();

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  return {
    user,
    loading,
    token,
    isAuthenticated: !!user,
    loginWithGoogle,
    logout,
  };
}
