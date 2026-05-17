import React, { createContext, useContext, useState, useEffect } from "react";

export type UserSession = "unauthenticated" | "candidate" | "recruiter";

/** Normalize role from Supabase user_metadata (string casing / missing values). */
export function normalizeUserRole(value: unknown): "candidate" | "recruiter" {
  const raw = typeof value === "string" ? value.trim().toLowerCase() : "";
  return raw === "recruiter" ? "recruiter" : "candidate";
}

interface AuthContextType {
  userSession: UserSession;
  userName: string;
  userEmail: string;
  login: (
    email: string,
    password: string,
    intendedRole?: "candidate" | "recruiter",
  ) => Promise<{ success: boolean; error?: string; role?: UserSession }>;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserSession,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function getSupabaseClient() {
  if (typeof window === "undefined") return null;
  const { supabase, isSupabaseConfigured } = await import("./supabase");
  if (!isSupabaseConfigured || !supabase) return null;
  return supabase;
}

function applySession(
  session: { user: { email?: string; user_metadata?: Record<string, unknown> } } | null,
  setUserSession: (s: UserSession) => void,
  setUserName: (n: string) => void,
  setUserEmail: (e: string) => void,
) {
  if (session?.user) {
    setUserSession(normalizeUserRole(session.user.user_metadata?.role));
    setUserName((session.user.user_metadata?.name as string) || "");
    setUserEmail(session.user.email || "");
  } else {
    setUserSession("unauthenticated");
    setUserName("");
    setUserEmail("");
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userSession, setUserSession] = useState<UserSession>("unauthenticated");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    void getSupabaseClient().then((client) => {
      if (cancelled) return;

      if (!client) {
        setLoading(false);
        return;
      }

      void client.auth.getSession().then(({ data: { session } }) => {
        if (cancelled) return;
        applySession(session, setUserSession, setUserName, setUserEmail);
        setLoading(false);
      });

      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event, session) => {
        if (cancelled) return;
        applySession(session, setUserSession, setUserName, setUserEmail);
      });

      unsubscribe = () => subscription.unsubscribe();
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const login = async (
    email: string,
    password: string,
    intendedRole?: "candidate" | "recruiter",
  ) => {
    const client = await getSupabaseClient();
    if (!client) {
      return {
        success: false,
        error: "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
      };
    }
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };

    const metadataRole = normalizeUserRole(data.user?.user_metadata?.role);
    const sessionRole =
      intendedRole === "recruiter" || intendedRole === "candidate" ? intendedRole : metadataRole;

    // Keep Supabase profile in sync with the role tab chosen at login
    if (intendedRole && intendedRole !== metadataRole) {
      const { error: updateError } = await client.auth.updateUser({
        data: {
          ...(data.user?.user_metadata ?? {}),
          role: intendedRole,
        },
      });
      if (updateError) {
        console.warn("Could not update user role in profile:", updateError.message);
      }
    }

    setUserSession(sessionRole);
    setUserName((data.user?.user_metadata?.name as string) || "");
    setUserEmail(data.user?.email || "");

    return {
      success: true,
      role: sessionRole,
    };
  };

  const register = async (email: string, password: string, name: string, role: UserSession) => {
    const client = await getSupabaseClient();
    if (!client) {
      return {
        success: false,
        error: "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
      };
    }
    const { error } = await client.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    const client = await getSupabaseClient();
    if (client) await client.auth.signOut();
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ userSession, userName, userEmail, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
