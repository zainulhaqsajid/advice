'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  authProvider: 'apple' | 'google' | 'email' | 'phone';
  avatar?: string;
}

export interface SavedReport {
  id: string;
  type: 'checklist' | 'cost' | 'timeline' | 'intake';
  title: string;
  pathway: string;
  date: string;
  data: Record<string, unknown>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  savedReports: SavedReport[];
  saveReport: (report: Omit<SavedReport, 'id' | 'date'>) => void;
  deleteReport: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('au_pr_user');
    const storedReports = localStorage.getItem('au_pr_reports');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedReports) {
      setSavedReports(JSON.parse(storedReports));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('au_pr_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('au_pr_user');
  };

  const saveReport = (report: Omit<SavedReport, 'id' | 'date'>) => {
    const newReport: SavedReport = {
      ...report,
      id: `report_${Date.now()}`,
      date: new Date().toISOString(),
    };
    const updated = [...savedReports, newReport];
    setSavedReports(updated);
    localStorage.setItem('au_pr_reports', JSON.stringify(updated));
  };

  const deleteReport = (id: string) => {
    const updated = savedReports.filter((r) => r.id !== id);
    setSavedReports(updated);
    localStorage.setItem('au_pr_reports', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        savedReports,
        saveReport,
        deleteReport,
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
