"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, photoURL: string, password: string) => Promise<{ success: boolean; message: string }>;
  googleLogin: (profile?: { name: string; email: string; photoURL: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUserProfile: (name: string, photoURL?: string) => Promise<{ success: boolean; message: string }>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore session from localStorage on initial render
  useEffect(() => {
    async function restoreSession() {
      try {
        const storedToken = localStorage.getItem("caresphere_token");
        const storedUser = localStorage.getItem("caresphere_user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token validity with backend
          try {
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });
            const data = await res.json();
            if (data.success && data.user) {
              setUser(data.user);
              localStorage.setItem("caresphere_user", JSON.stringify(data.user));
            } else {
              // Token expired or invalid
              logout();
            }
          } catch (err) {
            console.warn("Could not verify session with server, keeping cached user:", err);
          }
        }
      } catch (e) {
        console.error("Error restoring auth session:", e);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("caresphere_token", data.token);
        localStorage.setItem("caresphere_user", JSON.stringify(data.user));
        return { success: true, message: data.message || "Logged in successfully!" };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error: any) {
      return { success: false, message: error.message || "Network error. Please try again." };
    }
  };

  const register = async (name: string, email: string, photoURL: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, photoURL, password }),
      });
      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("caresphere_token", data.token);
        localStorage.setItem("caresphere_user", JSON.stringify(data.user));
        return { success: true, message: data.message || "Registration successful!" };
      } else {
        return { success: false, message: data.message || "Registration failed" };
      }
    } catch (error: any) {
      return { success: false, message: error.message || "Network error. Please try again." };
    }
  };

  const googleLogin = async (profile?: { name: string; email: string; photoURL: string }) => {
    try {
      // If profile is provided, use it, otherwise use realistic demo Google profile
      const defaultProfile = {
        name: "Ayman Sadiq",
        email: "ayman.sadiq@gmail.com",
        photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80",
      };

      const payload = profile || defaultProfile;

      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("caresphere_token", data.token);
        localStorage.setItem("caresphere_user", JSON.stringify(data.user));
        return { success: true, message: data.message || "Google login successful!" };
      } else {
        return { success: false, message: data.message || "Google login failed" };
      }
    } catch (error: any) {
      return { success: false, message: error.message || "Network error during Google login." };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("caresphere_token");
    localStorage.removeItem("caresphere_user");
    toast.success("Logged out successfully");
  };

  const updateUserProfile = async (name: string, photoURL?: string) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, photoURL }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        if (data.token) {
          setToken(data.token);
          localStorage.setItem("caresphere_token", data.token);
        }
        localStorage.setItem("caresphere_user", JSON.stringify(data.user));
        return { success: true, message: data.message || "Profile updated!" };
      } else {
        return { success: false, message: data.message || "Update failed" };
      }
    } catch (error: any) {
      return { success: false, message: error.message || "Network error" };
    }
  };

  // Helper to make authenticated requests with token attached
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return fetch(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateUserProfile,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
