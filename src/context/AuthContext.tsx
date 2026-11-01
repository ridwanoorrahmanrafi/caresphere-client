"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import toast from "react-hot-toast";
import { auth, googleProvider } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, photoURL: string, password: string) => Promise<{ success: boolean; message: string }>;
  googleLogin: () => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUserProfile: (name: string, photoURL?: string) => Promise<{ success: boolean; message: string }>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync session across Firebase Auth and LocalStorage/Backend
  useEffect(() => {
    const hasFirebase = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && !!auth;

    if (hasFirebase && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser && firebaseUser.email) {
          const userObj: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "Volunteer",
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
          };

          const idToken = await firebaseUser.getIdToken();
          setToken(idToken);
          setUser(userObj);
          localStorage.setItem("caresphere_token", idToken);
          localStorage.setItem("caresphere_user", JSON.stringify(userObj));
        } else {
          const storedToken = localStorage.getItem("caresphere_token");
          const storedUser = localStorage.getItem("caresphere_user");
          if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            setUser(null);
            setToken(null);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      try {
        const storedToken = localStorage.getItem("caresphere_token");
        const storedUser = localStorage.getItem("caresphere_user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          fetch(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.user) {
                setUser(data.user);
                localStorage.setItem("caresphere_user", JSON.stringify(data.user));
              }
            })
            .catch((err) => console.warn("Backend auth verification note:", err.message));
        }
      } catch (e) {
        console.error("Auth restore error:", e);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const hasFirebase = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && !!auth;

    if (hasFirebase && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        const idToken = await fbUser.getIdToken();

        const userObj: User = {
          id: fbUser.uid,
          name: fbUser.displayName || "Volunteer",
          email: fbUser.email || email,
          photoURL: fbUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        };

        setUser(userObj);
        setToken(idToken);
        localStorage.setItem("caresphere_token", idToken);
        localStorage.setItem("caresphere_user", JSON.stringify(userObj));

        try {
          await fetch(`${API_BASE_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userObj),
          });
        } catch {}

        return { success: true, message: "Logged in successfully with Firebase!" };
      } catch (error: any) {
        return { success: false, message: error.message || "Invalid email or password." };
      }
    }

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
    const hasFirebase = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && !!auth;

    if (hasFirebase && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        await updateProfile(fbUser, {
          displayName: name,
          photoURL: photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        });

        const idToken = await fbUser.getIdToken();
        const userObj: User = {
          id: fbUser.uid,
          name,
          email,
          photoURL: photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        };

        setUser(userObj);
        setToken(idToken);
        localStorage.setItem("caresphere_token", idToken);
        localStorage.setItem("caresphere_user", JSON.stringify(userObj));

        try {
          await fetch(`${API_BASE_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userObj),
          });
        } catch {}

        return { success: true, message: "Registered successfully with Firebase!" };
      } catch (error: any) {
        return { success: false, message: error.message || "Registration failed" };
      }
    }

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

  const googleLogin = async () => {
    const hasFirebase = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && !!auth;

    if (hasFirebase && auth) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const idToken = await fbUser.getIdToken();

        const userObj: User = {
          id: fbUser.uid,
          name: fbUser.displayName || "Volunteer",
          email: fbUser.email || "",
          photoURL: fbUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80",
        };

        setUser(userObj);
        setToken(idToken);
        localStorage.setItem("caresphere_token", idToken);
        localStorage.setItem("caresphere_user", JSON.stringify(userObj));

        try {
          await fetch(`${API_BASE_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userObj),
          });
        } catch {}

        return { success: true, message: "Signed in with Google successfully!" };
      } catch (error: any) {
        return { success: false, message: error.message || "Google sign-in failed." };
      }
    }

    try {
      const defaultProfile = {
        name: "Ayman Sadiq",
        email: "ayman.sadiq@gmail.com",
        photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80",
      };

      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultProfile),
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

  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch {}
    setToken(null);
    setUser(null);
    localStorage.removeItem("caresphere_token");
    localStorage.removeItem("caresphere_user");
    toast.success("Logged out successfully");
  };

  const updateUserProfile = async (name: string, photoURL?: string) => {
    if (auth && auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: photoURL || auth.currentUser.photoURL,
        });
      } catch (err) {
        console.warn("Firebase profile update error:", err);
      }
    }

    if (token) {
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
          localStorage.setItem("caresphere_user", JSON.stringify(data.user));
          return { success: true, message: data.message || "Profile updated!" };
        }
      } catch {}
    }

    if (user) {
      const updated = { ...user, name, photoURL: photoURL || user.photoURL };
      setUser(updated);
      localStorage.setItem("caresphere_user", JSON.stringify(updated));
      return { success: true, message: "Profile updated successfully!" };
    }

    return { success: false, message: "Failed to update profile." };
  };

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
