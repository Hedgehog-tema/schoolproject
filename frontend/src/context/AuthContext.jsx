import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("taija_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user } = await api.me();
      setUser(user);
    } catch {
      localStorage.removeItem("taija_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function login(email, password) {
    const { token, user } = await api.login({ email, password });
    localStorage.setItem("taija_token", token);
    setUser(user);
    return user;
  }

  async function register(payload) {
    const { token, user } = await api.register(payload);
    localStorage.setItem("taija_token", token);
    setUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem("taija_token");
    setUser(null);
  }

  async function refreshUser() {
    await loadUser();
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
