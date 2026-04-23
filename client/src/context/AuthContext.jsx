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
      if (data.streakResult?.xpAwarded > 0) {
        console.log(`🔥 Streak! Awarded ${data.streakResult.xpAwarded} XP`);
      }
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

  const emailLogin = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    return data.user;
  }, []);

  const emailRegister = useCallback(async (name, email, password, role) => {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    return data.user;
  }, []);

  const loginWithGoogle = useCallback(() => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${baseUrl}/auth/google`;
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, logout, loginWithGoogle,
      emailLogin, emailRegister,
      isAuthenticated: !!user,
      refreshUser: fetchUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
