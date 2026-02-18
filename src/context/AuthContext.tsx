'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Profile } from '@/lib/supabase/types';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  authProvider: string;
  avatar?: string;
  role: 'client' | 'agent' | 'admin';
}

// Keep SavedReport interface for backward compatibility
export interface SavedReportLocal {
  id: string;
  type: 'checklist' | 'cost' | 'timeline' | 'intake' | 'points';
  title: string;
  pathway: string;
  date: string;
  data: Record<string, unknown>;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  loginWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  loginWithGoogle: () => Promise<void>;
  loginWithOTP: (email: string) => Promise<{ error: string | null }>;
  verifyOTP: (email: string, token: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  savedReports: SavedReportLocal[];
  saveReport: (report: Omit<SavedReportLocal, 'id' | 'date'>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  refreshReports: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function supabaseUserToUser(supabaseUser: SupabaseUser, profile?: Profile | null): User {
  return {
    id: supabaseUser.id,
    name: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email || '',
    phone: supabaseUser.phone || profile?.phone || undefined,
    authProvider: supabaseUser.app_metadata?.provider || 'email',
    avatar: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || undefined,
    role: profile?.role || 'client',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [savedReports, setSavedReports] = useState<SavedReportLocal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data);
    return data;
  }, [supabase]);

  const fetchReports = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('saved_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped: SavedReportLocal[] = data.map((r: any) => ({
        id: r.id,
        type: r.type as SavedReportLocal['type'],
        title: r.title,
        pathway: r.pathway,
        date: r.created_at,
        data: (r.data as Record<string, unknown>) || {},
      }));
      setSavedReports(mapped);
    }
  }, [supabase]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setUser(supabaseUserToUser(session.user, profileData));
          await fetchReports(session.user.id);
        }
      } catch {
        // Auth not available yet, fallback to localStorage for backwards compat
        const storedUser = localStorage.getItem('au_pr_user');
        const storedReports = localStorage.getItem('au_pr_reports');
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedReports) setSavedReports(JSON.parse(storedReports));
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setUser(supabaseUserToUser(session.user, profileData));
          await fetchReports(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setSavedReports([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile, fetchReports]);

  // Legacy login (backward compatibility for mock auth)
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('au_pr_user', JSON.stringify(userData));
  };

  const loginWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const loginWithOTP = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) return { error: error.message };
    return { error: null };
  };

  const verifyOTP = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (error) return { error: error.message };
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSavedReports([]);
    localStorage.removeItem('au_pr_user');
    localStorage.removeItem('au_pr_reports');
  };

  const saveReport = async (report: Omit<SavedReportLocal, 'id' | 'date'>) => {
    if (user) {
      // Try to save to Supabase first
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from('saved_reports')
          .insert({
            user_id: session.user.id,
            type: report.type,
            title: report.title,
            pathway: report.pathway,
            data: report.data as Record<string, unknown>,
          })
          .select()
          .single();

        if (!error && data) {
          const newReport: SavedReportLocal = {
            id: data.id,
            type: data.type as SavedReportLocal['type'],
            title: data.title,
            pathway: data.pathway,
            date: data.created_at,
            data: (data.data as Record<string, unknown>) || {},
          };
          setSavedReports(prev => [newReport, ...prev]);
          return;
        }
      }
    }

    // Fallback to localStorage
    const newReport: SavedReportLocal = {
      ...report,
      id: `report_${Date.now()}`,
      date: new Date().toISOString(),
    };
    const updated = [newReport, ...savedReports];
    setSavedReports(updated);
    localStorage.setItem('au_pr_reports', JSON.stringify(updated));
  };

  const deleteReport = async (id: string) => {
    // Try Supabase first
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('saved_reports').delete().eq('id', id).eq('user_id', session.user.id);
    }

    const updated = savedReports.filter((r) => r.id !== id);
    setSavedReports(updated);
    localStorage.setItem('au_pr_reports', JSON.stringify(updated));
  };

  const refreshReports = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await fetchReports(session.user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        loginWithOTP,
        verifyOTP,
        logout,
        savedReports,
        saveReport,
        deleteReport,
        refreshReports,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
