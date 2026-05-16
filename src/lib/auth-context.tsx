import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

export type UserSession = "unauthenticated" | "candidate" | "recruiter";

interface AuthContextType {
  userSession: UserSession;
  userName: string;
  userEmail: string;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserSession }>;
  register: (email: string, password: string, name: string, role: UserSession) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userSession, setUserSession] = useState<UserSession>("unauthenticated");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserSession((session.user.user_metadata?.role as UserSession) || "candidate");
        setUserName(session.user.user_metadata?.name || "");
        setUserEmail(session.user.email || "");
      } else {
        setUserSession("unauthenticated");
        setUserName("");
        setUserEmail("");
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserSession((session.user.user_metadata?.role as UserSession) || "candidate");
        setUserName(session.user.user_metadata?.name || "");
        setUserEmail(session.user.email || "");
      } else {
        setUserSession("unauthenticated");
        setUserName("");
        setUserEmail("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { 
      success: true, 
      role: (data.user?.user_metadata?.role as UserSession) || "candidate" 
    };
  };

  const register = async (email: string, password: string, name: string, role: UserSession) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ userSession, userName, userEmail, login, register, logout }}
    >
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
