import { createContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      if (!token) { setLoading(false); return; }
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const login = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const loginWithGoogle = useCallback(() => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${baseUrl}/auth/google`;
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, logout, loginWithGoogle,
      isAuthenticated: !!user,
      refreshUser: fetchUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
