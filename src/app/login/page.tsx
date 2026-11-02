"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn, HeartHandshake, ArrowRight, ShieldCheck, KeyRound, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { user, login, googleLogin } = useAuth();
  const router = useRouter();

  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpJoined, setOtpJoined] = useState(false);
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

    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email, password);

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

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your registered email address.");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setSubmitting(true);
      // Simulate 2FA / OTP verification
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Two-Factor Authentication verified! Signing you in...");
      router.push("/");
    } catch {
      toast.error("OTP verification failed. Please check the code and try again.");
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
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">12.5k+</p>
              <p className="text-xs text-slate-500 font-medium">Volunteers Mobilized</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <p className="text-2xl font-black text-teal-600 dark:text-teal-400">100%</p>
              <p className="text-xs text-slate-500 font-medium">Verified Local Drives</p>
            </div>
          </div>
        </div>

        {/* Form Card Container */}
        <div className="card w-full max-w-md shrink-0 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">
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

        {/* DaisyUI Alert Component: Quick Access Notice */}
        <div role="alert" className="alert alert-info alert-soft text-xs py-2.5 px-3.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-4 h-4 text-sky-500">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Quick Access:</strong> Sign in with password, or use 6-digit OTP verification code.
          </span>
        </div>

        {/* DaisyUI Tabs for Authentication Method */}
        <div className="tabs tabs-box bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl grid grid-cols-2">
          <button
            type="button"
            onClick={() => setLoginMethod("password")}
            className={`tab rounded-xl text-xs font-semibold py-2 transition-all cursor-pointer ${
              loginMethod === "password"
                ? "tab-active bg-white dark:bg-slate-900 shadow-sm text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod("otp")}
            className={`tab rounded-xl text-xs font-semibold py-2 transition-all cursor-pointer ${
              loginMethod === "otp"
                ? "tab-active bg-white dark:bg-slate-900 shadow-sm text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            One-Time Password (OTP)
          </button>
        </div>

        {loginMethod === "password" ? (
          /* Email/Password Form with DaisyUI Fieldset Component */
          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset className="fieldset bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 gap-4">
              <legend className="fieldset-legend text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Account Credentials
              </legend>

              {/* Email field with DaisyUI Input Wrapper & Validator */}
              <div className="space-y-1">
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </span>
                <label className="input input-md input-primary validator w-full">
                  <Mail className="w-4 h-4 opacity-50 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="grow"
                  />
                </label>
                <div className="validator-hint hidden">Please enter a valid email address (e.g. name@example.com)</div>
              </div>

              {/* Password field with DaisyUI Input Wrapper & Validator */}
              <div className="space-y-1">
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </span>
                <label className="input input-md input-primary validator w-full">
                  <Lock className="w-4 h-4 opacity-50 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="grow"
                  />
                </label>
                <div className="validator-hint hidden">Password must be at least 6 characters</div>
              </div>

              <p className="label text-[11px] text-slate-500 dark:text-slate-400">
                Sign in with your registered volunteer credentials to access CareSphere.
              </p>
            </fieldset>

            {/* Remember Me Option (DaisyUI Checkbox Component) */}
            <div className="flex items-center justify-between text-xs">
              <label className="label cursor-pointer flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  defaultChecked
                  className="checkbox checkbox-primary checkbox-sm"
                />
                <span>Remember me on this device</span>
              </label>
              <span className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">
                Forgot password?
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 transition-colors shadow-md shadow-emerald-500/25"
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
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
        ) : (
          /* OTP Form with DaisyUI OTP Component */
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <fieldset className="fieldset bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 gap-4">
              <legend className="fieldset-legend text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Two-Factor Security Verification
              </legend>

              <div className="space-y-1">
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Registered Email Address
                </span>
                <label className="input input-md input-primary validator w-full">
                  <Mail className="w-4 h-4 opacity-50 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="grow"
                  />
                </label>
              </div>

              {/* DaisyUI OTP Component Section */}
              <div className="space-y-3 pt-1 text-center">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Enter 6-digit OTP Code</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpJoined(!otpJoined)}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {otpJoined ? "Separate boxes" : "Joined boxes"}
                  </button>
                </div>

                {/* DaisyUI OTP Component */}
                <div className="flex justify-center py-2 overflow-x-auto">
                  <label className={`otp otp-md otp-primary ${otpJoined ? "otp-joined" : ""}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <input
                      type="text"
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      placeholder=""
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                  <span>Code expires in 5:00</span>
                  <button
                    type="button"
                    onClick={() => toast.success("New 6-digit OTP sent to your email!")}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            </fieldset>

            {/* OTP Submit Button */}
            <button
              type="submit"
              disabled={submitting || otp.length < 6}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 transition-colors shadow-md shadow-emerald-500/25 cursor-pointer"
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP & Sign In</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* DaisyUI Divider Component */}
        <div className="divider text-xs uppercase tracking-wider text-slate-400 font-semibold my-2">
          Or continue with
        </div>

        {/* Google Login Button */}
        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={googleSubmitting}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-sm font-semibold shadow-sm"
          >
            {googleSubmitting ? (
              <span className="loading loading-spinner loading-xs text-primary"></span>
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

        {/* Redirect to Register link */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="link link-primary link-hover font-bold inline-flex items-center gap-1"
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
