import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify existing session on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = Cookies.get('access_token');
      if (token) {
        try {
          const { data } = await authAPI.me();
          setUser(data);
        } catch {
          Cookies.remove('access_token');
        }
      }
      setLoading(false);
    };
    verifySession();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authAPI.login(credentials);
    // Store token in cookie (7-day expiry, SameSite=Strict)
    Cookies.set('access_token', data.access_token, {
      expires: 7,
      sameSite: 'Strict',
      secure: window.location.protocol === 'https:',
    });
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch (_) { /* ignore */ }
    Cookies.remove('access_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
