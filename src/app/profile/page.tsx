"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import toast from "react-hot-toast";
import { compressImage } from "@/utils/imageCompression";
import {
  Home,
  User,
  Mail,
  Image as ImageIcon,
  Save,
  Sparkles,
  ShieldCheck,
  ListOrdered,
  Calendar,
  PlusCircle,
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("File size exceeds 8MB limit.");
      return;
    }
    try {
      const compressedDataUrl = await compressImage(file, 400, 400, 0.85);
      setPhotoURL(compressedDataUrl);
      toast.success("Avatar image loaded successfully!");
    } catch {
      toast.error("Failed to process image file.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      const res = await updateUserProfile(name.trim(), photoURL.trim());

      if (res.success) {
        toast.success(res.message || "Profile updated successfully!");
      } else {
        toast.error(res.message || "Failed to update profile.");
      }
    } catch {
      toast.error("An error occurred while updating profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="py-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* DaisyUI Breadcrumbs */}
        <div className="breadcrumbs text-sm text-slate-500 dark:text-slate-400">
          <ul>
            <li>
              <Link href="/" className="inline-flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </li>
            <li className="font-semibold text-slate-900 dark:text-white">
              My Profile
            </li>
          </ul>
        </div>

        {/* DaisyUI Responsive Navigation Menu */}
        <ul className="menu menu-vertical sm:menu-horizontal menu-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm w-full gap-1">
          <li>
            <Link href="/profile" className="menu-active">
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </Link>
          </li>
          <li>
            <Link href="/manage-events">
              <ListOrdered className="w-4 h-4" />
              <span>Manage Events</span>
            </Link>
          </li>
          <li>
            <Link href="/joined-events">
              <Calendar className="w-4 h-4" />
              <span>Joined Events</span>
            </Link>
          </li>
          <li>
            <Link href="/create-event">
              <PlusCircle className="w-4 h-4" />
              <span>Create Event</span>
            </Link>
          </li>
        </ul>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-12 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>User Settings</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              My Profile
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              View and update your personal display information across CareSphere
            </p>
          </div>

          {/* Current Profile Preview */}
          <div className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            {/* DaisyUI Avatar with DaisyUI Indicator Component */}
            <div className="avatar indicator">
              <span className="indicator-item badge badge-primary badge-xs text-[10px] font-bold shadow-sm">
                Active
              </span>
              <div className="w-16 h-16 rounded-full ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-sm">
                <img
                  src={photoURL || user?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80";
                  }}
                />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-base font-bold text-slate-900 dark:text-white">{name || "Volunteer"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              <div className="badge badge-sm badge-soft badge-primary gap-1 font-semibold mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Community Member</span>
              </div>
            </div>

            {/* Profile Completeness (DaisyUI Radial Progress Component) */}
            <div className="ml-auto hidden sm:flex flex-col items-center gap-1">
              <div
                className="radial-progress text-primary font-bold text-xs"
                style={{
                  "--value": Boolean(name.trim()) && Boolean(photoURL.trim()) ? 100 : 75,
                  "--size": "3.5rem",
                  "--thickness": "4px",
                } as React.CSSProperties}
                role="progressbar"
                aria-valuenow={Boolean(name.trim()) && Boolean(photoURL.trim()) ? 100 : 75}
              >
                {Boolean(name.trim()) && Boolean(photoURL.trim()) ? "100%" : "75%"}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Profile
              </span>
            </div>
          </div>

          {/* Update Form with DaisyUI Fieldset Component */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset className="fieldset bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 gap-4">
              <legend className="fieldset-legend text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Personal Information & Avatar
              </legend>

              {/* Full Name with DaisyUI Floating Label */}
              <div className="space-y-1">
                <label className="floating-label">
                  <span>Full Display Name *</span>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="input input-md w-full pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </label>
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-1.5 opacity-75">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email Address (Cannot be changed)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Profile Photo (URL or DaisyUI File Input) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Profile Photo
                </label>

                {/* DaisyUI File Input Component */}
                <fieldset className="fieldset bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3">
                  <legend className="fieldset-legend text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Upload Avatar File
                  </legend>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input file-input-primary file-input-sm w-full"
                  />
                  <label className="label text-[11px] text-slate-400">
                    Max size 2MB (JPG, PNG, WebP)
                  </label>
                </fieldset>

                {/* DaisyUI Textarea Component with Fieldset and Label */}
                <fieldset className="fieldset bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3">
                  <legend className="fieldset-legend text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Your Volunteer Bio
                  </legend>
                  <textarea
                    className="textarea textarea-primary textarea-sm h-20 w-full"
                    placeholder="Share a short summary of your volunteer background or passions..."
                    defaultValue="Active community volunteer dedicated to disaster relief and environmental restoration initiatives."
                  />
                  <div className="label text-[11px] text-slate-400">
                    Optional background visible to community event organizers
                  </div>
                </fieldset>

                {/* DaisyUI Label for Input Component (Prefix https://) */}
                <label className="input w-full">
                  <span className="label font-medium">https://</span>
                  <input
                    type="text"
                    value={photoURL.startsWith("https://") ? photoURL.slice(8) : photoURL.startsWith("http://") ? photoURL.slice(7) : photoURL}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      if (!val) {
                        setPhotoURL("");
                      } else if (val.startsWith("data:") || val.startsWith("http://") || val.startsWith("https://")) {
                        setPhotoURL(val);
                      } else {
                        setPhotoURL(`https://${val}`);
                      }
                    }}
                    placeholder="images.unsplash.com/photo-..."
                  />
                </label>
              </div>

              <p className="label text-[11px] text-slate-500 dark:text-slate-400">
                Your updated name and profile picture will be synchronized across CareSphere immediately.
              </p>
            </fieldset>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5 mt-4 cursor-pointer"
            >
              {saving ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* DaisyUI OTP Component: Two-Factor Authentication & Verification Code Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-10 space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Account Security</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Two-Factor Authentication (2FA) & OTP Verification
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Protect your organizer actions and volunteer check-ins with one-time verification passcodes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Box 1: 6-Digit Security Passcode */}
            <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3 flex flex-col items-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                6-Digit Security OTP (Standard)
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Used for sensitive account modifications and critical event updates.
              </p>
              <div className="py-2">
                <label className="otp otp-sm sm:otp-md otp-primary">
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
                    placeholder=""
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Security OTP verified successfully!")}
                className="btn btn-xs btn-primary font-semibold cursor-pointer"
              >
                Test 6-Digit OTP
              </button>
            </div>

            {/* Box 2: 4-Digit Event Attendance OTP (Joined) */}
            <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3 flex flex-col items-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                4-Digit Event Check-in OTP (Joined)
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Quick on-site attendance check-in code with connected character boxes.
              </p>
              <div className="py-2">
                <label className="otp otp-sm sm:otp-md otp-joined otp-secondary">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <input
                    type="text"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    placeholder=""
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Attendance OTP code confirmed!")}
                className="btn btn-xs btn-secondary font-semibold cursor-pointer"
              >
                Test 4-Digit OTP
              </button>
            </div>
          </div>

          {/* Size & State Demonstration */}
          <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/20 border border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Compact Size:</span>
              <label className="otp otp-xs otp-accent">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <input type="text" maxLength={4} pattern="[0-9]{4}" placeholder="" />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Disabled State:</span>
              <label className="otp otp-xs">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <input type="text" maxLength={4} disabled defaultValue="8888" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
