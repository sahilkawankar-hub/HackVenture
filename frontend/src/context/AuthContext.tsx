import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export type UserRole = "user" | "admin";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  token: string | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  token: null,
  role: "user",
  setRole: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>(() => {
    // Persist role selection across refreshes
    return (localStorage.getItem("civilink_role") as UserRole) || "user";
  });

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem("civilink_role", newRole);
  };

  useEffect(() => {
    // Fetch active session from Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      setLoading(false);
    });

    // Listen to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, token, role, setRole: handleSetRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export default AuthContext;
