import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiRegister, apiLogout } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('eventica_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  async function login(emailOrUsername, password) {
    try {
      const data = await apiLogin(emailOrUsername, password);
      const u = { ...data.user, name: data.user.username };
      setUser(u);
      localStorage.setItem('eventica_user', JSON.stringify(u));
      return { success: true, user: u };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async function register(name, email, password) {
    try {
      await apiRegister(name, email, password);
      return await login(name, password);
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async function logout() {
    try { await apiLogout(); } catch (_) {}
    setUser(null);
    localStorage.removeItem('eventica_user');
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
