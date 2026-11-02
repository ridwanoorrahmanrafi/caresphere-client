"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  User as UserIcon,
  Mail,
  Lock,
  Image as ImageIcon,
  UserPlus,
  HeartHandshake,
  ArrowRight,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const { user, register, googleLogin } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Real-time password criteria trackers
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength;

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Password validation rule check
    if (!hasUpperCase) {
      toast.error("Password must contain at least one uppercase letter (A-Z).");
      return;
    }

    if (!hasLowerCase) {
      toast.error("Password must contain at least one lowercase letter (a-z).");
      return;
    }

    if (!hasMinLength) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await register(
        name.trim(),
        email.trim(),
        photoURL.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        password
      );

      if (res.success) {
        toast.success(res.message || "Account registered successfully!");
        router.push("/");
      } else {
        toast.error(res.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoURL(reader.result);
        toast.success("Profile photo uploaded!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleSubmitting(true);
      const res = await googleLogin();
      if (res.success) {
        toast.success("Signed up successfully with Google!");
        router.push("/");
      } else {
        toast.error(res.message || "Google signup failed.");
      }
    } catch {
      toast.error("Google signup encountered an error.");
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="hero min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
      {/* DaisyUI Hero Content: Hero with Form */}
      <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-5xl gap-12 lg:gap-16 items-center">
        {/* Narrative / Context Column */}
        <div className="text-center lg:text-left max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Join CareSphere Community</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Empower Change in Your City.
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Create an account to mobilize neighborhood drives, join verified volunteer initiatives, connect with local organizers, and track your social impact in real time.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100% Free</p>
              <p className="text-xs text-slate-500 font-medium">Community Access</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <p className="text-2xl font-black text-teal-600 dark:text-teal-400">Instant RSVP</p>
              <p className="text-xs text-slate-500 font-medium">Verified Volunteer Seats</p>
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
              Create an Account
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Join the community to volunteer, organize drives, and make a real difference
            </p>
          </div>

        {/* Registration Form with DaisyUI Fieldset Component */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fieldset 1: Volunteer Identity */}
          <fieldset className="fieldset bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 gap-3.5">
            <legend className="fieldset-legend text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Volunteer Identity
            </legend>

            {/* 1. Name with DaisyUI Input Wrapper & Validator */}
            <div className="space-y-1">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name *
              </span>
              <label className="input input-md input-primary validator w-full">
                <UserIcon className="w-4 h-4 opacity-50 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tanvir Ahmed"
                  className="grow"
                />
              </label>
              <div className="validator-hint hidden">Please enter your full name</div>
            </div>

            {/* 2. Email with DaisyUI Input Wrapper & Validator */}
            <div className="space-y-1">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address *
              </span>
              <label className="input input-md input-primary validator w-full">
                <Mail className="w-4 h-4 opacity-50 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tanvir@example.com"
                  className="grow"
                />
              </label>
              <div className="validator-hint hidden">Please enter a valid email address (e.g. tanvir@example.com)</div>
            </div>

            {/* 3. Photo (DaisyUI File Input or URL) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Profile Photo (Optional)
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="file-input file-input-primary file-input-xs sm:file-input-sm w-full"
                />
                <label className="input input-sm input-primary w-full flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 opacity-50 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <input
                    type="url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="Or enter image URL"
                    className="grow"
                  />
                </label>
              </div>
            </div>

            <p className="label text-[11px] text-slate-500 dark:text-slate-400">
              Your photo and name will appear when joining initiatives and organizing events.
            </p>
          </fieldset>

          {/* Fieldset 2: Security Credentials */}
          <fieldset className="fieldset bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 gap-3.5">
            <legend className="fieldset-legend text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Security Credentials
            </legend>

            {/* 4. Password with DaisyUI Input Wrapper & Validator */}
            <div className="space-y-1">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password *
              </span>
              <label className="input input-md input-primary validator w-full">
                <Lock className="w-4 h-4 opacity-50 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  pattern="(?=.*[a-z])(?=.*[A-Z]).{6,}"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  title="Must be at least 6 characters, including at least one uppercase and one lowercase letter"
                  className="grow"
                />
              </label>
              <div className="validator-hint hidden">Must contain 6+ chars with uppercase & lowercase letters</div>

              {/* Visual Password Requirement Hints */}
              <div className="pt-2 grid grid-cols-3 gap-2 text-[11px]">
                <div
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    hasUpperCase ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                  }`}
                >
                  {hasUpperCase ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  <span>1 Uppercase</span>
                </div>
                <div
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    hasLowerCase ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                  }`}
                >
                  {hasLowerCase ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  <span>1 Lowercase</span>
                </div>
                <div
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    hasMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                  }`}
                >
                  {hasMinLength ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  <span>6+ Chars</span>
                </div>
              </div>
            </div>

            {/* Terms Agreement (DaisyUI Checkbox & Validator Component) */}
            <div className="pt-1">
              <label className="label cursor-pointer flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  required
                  defaultChecked
                  className="checkbox checkbox-primary validator checkbox-sm mt-0.5"
                  title="Required"
                />
                <span>
                  I agree to the <span className="font-semibold text-emerald-600 dark:text-emerald-400">Volunteer Code of Conduct</span> and community terms of service.
                </span>
              </label>
              <p className="validator-hint hidden">You must agree to the volunteer code of conduct</p>
            </div>
          </fieldset>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5 mt-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Complete Registration</span>
              </>
            )}
          </button>
        </form>

        {/* DaisyUI Divider Component */}
        <div className="divider text-xs uppercase tracking-wider text-slate-400 font-semibold my-2">
          Or register with
        </div>

        {/* Google Signup Button */}
        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={googleSubmitting}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all text-sm font-semibold shadow-sm hover:shadow hover:-translate-y-0.5 cursor-pointer"
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
            <span>Sign up with Google</span>
          </button>
        </div>

        {/* 5. Link redirect to Login page */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="link link-primary link-hover font-bold inline-flex items-center gap-1"
          >
            <span>Login here</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}
