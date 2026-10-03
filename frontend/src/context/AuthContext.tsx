"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchApi } from "@/utils/api";

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  addresses?: Array<{
    _id?: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault?: boolean;
  }>;
}

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const savedToken = localStorage.getItem("seed_auth_token");
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      setToken(savedToken);
      const res = await fetchApi<{ success: boolean; user: IUser }>("/auth/me");
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch {
      localStorage.removeItem("seed_auth_token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetchApi<{ success: boolean; token: string; user: IUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.success) {
      localStorage.setItem("seed_auth_token", res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const res = await fetchApi<{ success: boolean; token: string; user: IUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    });

    if (res.success) {
      localStorage.setItem("seed_auth_token", res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const logout = () => {
    localStorage.removeItem("seed_auth_token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};