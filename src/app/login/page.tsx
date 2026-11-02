"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  LogIn,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPage() {
  const { user, login, googleLogin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email.trim(), password);

      if (res.success) {
        toast.success(res.message || "Logged in successfully!");
        router.push("/");
      } else {
        toast.error(res.message || "Invalid credentials.");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong during login.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleSubmitting(true);
      const res = await googleLogin();
      if (res.success) {
        toast.success("Welcome back! Signed in with Google.");
        router.push("/");
      } else {
        toast.error(res.message || "Google sign-in failed.");
      }
    } catch (err: any) {
      toast.error("Google sign-in encountered an error.");
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="hero min-h-[82vh] py-12 px-4 sm:px-6 lg:px-8">
      {/* DaisyUI Hero Content: Hero with Form */}
      <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-5xl gap-12 lg:gap-16 items-center">
        {/* Narrative / Context Column */}
        <div className="text-center lg:text-left max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Community Authentication Portal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Connect. Volunteer. Transform.
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Sign in to track your volunteer hours, organize grassroots events, and lead community development projects across your neighborhood.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">14.8k+</p>
              <p className="text-xs text-slate-500 font-medium">Volunteers Mobilized</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <p className="text-2xl font-black text-teal-600 dark:text-teal-400">100%</p>
              <p className="text-xs text-slate-500 font-medium">Verified Local Drives</p>
            </div>
          </div>
        </div>

        {/* Form Card Container */}
        <div className="card w-full max-w-md shrink-0 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-500/25">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sign in to track your volunteer commitments and manage events
            </p>
          </div>

          {/* Email/Password Form (Specification Requirement 1) */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Email field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all shadow-sm"
                />
              </div>
            </div>

            {/* 2. Password field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer mt-2"
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider text-xs uppercase tracking-wider text-slate-400 font-semibold my-2">
            Or continue with
          </div>

          {/* 3. Google Sign-In Button (Specification Requirement 3) */}
          <div>
            <button
              onClick={handleGoogleLogin}
              disabled={googleSubmitting}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-semibold shadow-sm hover:shadow hover:-translate-y-0.5 cursor-pointer"
            >
              {googleSubmitting ? (
                <span className="loading loading-spinner loading-xs text-primary" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.15C3.25 21.36 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.39l4-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.27 6.61l4 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>
          </div>

          {/* 4. Link that redirects to Register page (Specification Requirement 4) */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold inline-flex items-center gap-1 hover:underline"
            >
              <span>Register here</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
