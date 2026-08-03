import { createContext, useContext, useState, ReactNode } from 'react';
import { getToken, setToken, clearToken } from './client';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('taskhub_user');
    return raw ? JSON.parse(raw) : null;
  });

  const login = (token: string, newUser: AuthUser) => {
    setToken(token);
    localStorage.setItem('taskhub_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem('taskhub_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!getToken(), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
