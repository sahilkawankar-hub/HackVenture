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
  isDemo: boolean;
  loginAsDemo: (role?: UserRole) => void;
}

const mockDemoUser: User = {
  id: "demo-user-123",
  app_metadata: { provider: "email" },
  user_metadata: { full_name: "Alex Johnson (Demo Resident)" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "alex.johnson@demo.civilink.ai",
  phone: "",
  role: "authenticated",
  updated_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  token: null,
  role: "user",
  setRole: () => {},
  isDemo: false,
  loginAsDemo: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(() => {
    return localStorage.getItem("civilink_demo") === "true";
  });
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem("civilink_role") as UserRole) || "user";
  });

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem("civilink_role", newRole);
  };

  const loginAsDemo = (demoRole: UserRole = "user") => {
    const demoUser = {
      ...mockDemoUser,
      user_metadata: {
        full_name: demoRole === "admin" ? "Admin Governance Officer" : "Alex Johnson (Resident)",
      },
      email: demoRole === "admin" ? "admin@demo.civilink.ai" : "alex.johnson@demo.civilink.ai",
    };

    setUser(demoUser);
    setRole(demoRole);
    setIsDemo(true);
    localStorage.setItem("civilink_demo", "true");
    localStorage.setItem("civilink_role", demoRole);
  };

  useEffect(() => {
    // If demo mode is active in localStorage, initialize demo state
    if (localStorage.getItem("civilink_demo") === "true") {
      const storedRole = (localStorage.getItem("civilink_role") as UserRole) || "user";
      loginAsDemo(storedRole);
      setLoading(false);
      return;
    }

    // Fetch active session from Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      setLoading(false);
    });

    // Listen to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (localStorage.getItem("civilink_demo") !== "true") {
        setSession(session);
        setUser(session?.user ?? null);
        setToken(session?.access_token ?? null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        token,
        role,
        setRole: handleSetRole,
        isDemo,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export default AuthContext;
