import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const response = await authApi.getMe();
    setUser(response.user || null);
    return response.user || null;
  };

  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      try {
        const response = await authApi.getMe();
        if (active) {
          setUser(response.user || null);
        }
      } catch (error) {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "Admin",
    setUser,
    refreshUser,
    async login(payload) {
      const response = await authApi.login(payload);
      setUser(response.user || null);
      return response.user || null;
    },
    async register(payload) {
      const response = await authApi.register(payload);
      setUser(response.user || null);
      return response.user || null;
    },
    async logout() {
      await authApi.logout();
      setUser(null);
    },
    async updateProfile(payload) {
      const response = await authApi.updateProfile(payload);
      setUser(response.user || null);
      return response.user || null;
    },
    async changePassword(payload) {
      return authApi.changePassword(payload);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
