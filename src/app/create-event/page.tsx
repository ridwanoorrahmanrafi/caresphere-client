"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import toast from "react-hot-toast";
import {
  Home,
  CalendarPlus,
  Image as ImageIcon,
  MapPin,
  Tag,
  AlignLeft,
  Calendar,
  Sparkles,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

const EVENT_TYPES = [
  "Donation Drive",
  "Clean-up",
  "Plantation",
  "Healthcare",
  "Education",
  "Food Relief",
  "Disaster Relief",
  "Other",
];


export default function CreateEventPage() {
  const { user, authFetch } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [thumbnail, setThumbnail] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [minDate, setMinDate] = useState("");

  React.useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  const completedFields = [
    Boolean(title.trim()),
    Boolean(eventType),
    Boolean(location.trim()),
    Boolean(eventDate),
    Boolean(thumbnail.trim()),
    Boolean(description.trim()),
  ].filter(Boolean).length;
  const formProgress = Math.round((completedFields / 6) * 100);

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setThumbnail(reader.result);
        toast.success("Event banner uploaded!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !thumbnail.trim() || !location.trim() || !eventDate) {
      toast.error("Please fill in all event fields.");
      return;
    }

    // Strict Future Date validation: Past date rejected!
    const selectedTime = new Date(eventDate).getTime();
    const now = new Date().getTime();
    if (selectedTime <= now) {
      toast.error("Event date must be in the future. Past dates cannot be added.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await authFetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          eventType,
          thumbnail: thumbnail.trim(),
          location: location.trim(),
          eventDate,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Event created successfully!");
        // Requirement: Redirect user to the Upcoming Events page
        router.push("/upcoming-events");
      } else {
        toast.error(data.message || "Failed to create event.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* DaisyUI Breadcrumbs */}
        <div className="breadcrumbs text-sm text-slate-500 dark:text-slate-400">
          <ul>
            <li>
              <Link href="/" className="inline-flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/manage-events" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                Organizer Portal
              </Link>
            </li>
            <li className="font-semibold text-slate-900 dark:text-white">
              Host Event
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-12 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Organizer Portal</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Host a Social Development Event
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Publish your community initiative. Your email ({user?.email}) will be attached as the
              verified creator.
            </p>
          </div>

          {/* DaisyUI Alert Component: Host Guidelines Notice */}
          <div role="alert" className="alert alert-warning alert-dash alert-vertical sm:alert-horizontal text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <span className="font-bold">Guidelines Notice:</span> All community initiatives are published live in real-time. Past dates are blocked to ensure active volunteer mobilization.
            </div>
          </div>

          {/* Form Completion Progress (DaisyUI Radial Progress & Progress Component) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-center gap-4">
            <div
              className="radial-progress text-primary font-bold text-xs shrink-0"
              style={{
                "--value": formProgress,
                "--size": "3.5rem",
                "--thickness": "4px",
              } as React.CSSProperties}
              role="progressbar"
              aria-valuenow={formProgress}
            >
              {formProgress}%
            </div>
            <div className="flex-1 w-full space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Form Readiness Dial
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {completedFields} of 6 Fields Completed
                </span>
              </div>
              {submitting ? (
                <progress className="progress progress-success w-full h-2"></progress>
              ) : (
                <progress
                  className="progress progress-primary w-full h-2"
                  value={formProgress}
                  max={100}
                ></progress>
              )}
            </div>
          </div>

          {/* Form with DaisyUI Fieldset Component */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fieldset 1: General Information & Scheduling */}
            <fieldset className="fieldset bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 gap-4">
              <legend className="fieldset-legend text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                General Information & Scheduling
              </legend>

              {/* 1. Title with DaisyUI Floating Label */}
              <div className="space-y-1">
                <label className="floating-label">
                  <span>Event Title *</span>
                  <input
                    type="text"
                    required
                    minLength={5}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Winter Clothes Distribution – Mirpur 10, Dhaka"
                    className="input input-md input-primary validator w-full"
                  />
                </label>
                <p className="validator-hint hidden">Event title must be at least 5 characters</p>
              </div>

              {/* 2. Event Type & Event Date with DaisyUI Label Primitives */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                {/* DaisyUI Label for Select Component */}
                <div className="space-y-1.5">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Event Type *</span>
                  </span>
                  <label className="select select-primary validator w-full">
                    <span className="label font-semibold">Type</span>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="cursor-pointer"
                      required
                    >
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                  <p className="validator-hint hidden">Please choose an event category</p>
                </div>

                {/* DaisyUI Label for Date Input Component */}
                <div className="space-y-1.5">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Event Date *</span>
                  </span>
                  <label className="input input-primary validator w-full">
                    <span className="label font-semibold">Event Date</span>
                    <input
                      type="date"
                      required
                      min={minDate}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </label>
                  <p className="validator-hint hidden">Please select a future event date</p>
                </div>
              </div>

              <p className="label text-[11px] text-slate-500 dark:text-slate-400">
                Choose an engaging title and select the exact date for volunteer dispatch.
              </p>
            </fieldset>

            {/* Fieldset 2: Location & Media Details */}
            <fieldset className="fieldset bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 gap-4">
              <legend className="fieldset-legend text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Location & Media Details
              </legend>

              {/* 3. Location & Thumbnail Image URL (Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Location *</span>
                  </label>
                  <label className="input input-md input-primary validator w-full">
                    <MapPin className="w-4 h-4 opacity-50 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <input
                      type="text"
                      required
                      minLength={3}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Mohammadpur Town Hall, Dhaka"
                      className="grow"
                    />
                  </label>
                  <p className="validator-hint hidden">Please enter a valid location</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Thumbnail Image *</span>
                  </label>
                  
                  {/* DaisyUI File Input Component with fieldset and label */}
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailFileChange}
                      className="file-input file-input-primary file-input-sm w-full"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">or URL:</span>
                      <label className="input input-sm input-primary validator flex-1 flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5 opacity-50 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <input
                          type="url"
                          value={thumbnail}
                          onChange={(e) => setThumbnail(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="grow"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Description with DaisyUI Floating Label & Validator */}
              <div className="space-y-1">
                <label className="floating-label">
                  <span>Detailed Description *</span>
                  <textarea
                    required
                    minLength={10}
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your social service event, target community, items needed, and instructions for volunteers..."
                    className="textarea textarea-md textarea-primary validator w-full resize-y"
                  />
                </label>
                <p className="validator-hint hidden">Description must be at least 10 characters</p>
              </div>

              {/* Thumbnail Live Preview with DaisyUI Window Mockup */}
              {thumbnail && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Banner Asset Inspector:
                  </p>
                  <div className="mockup-window border border-base-300 bg-base-100 shadow-sm w-full">
                    <div className="border-t border-base-300 w-full h-44 overflow-hidden">
                      <img
                        src={thumbnail}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </fieldset>

            {/* Fieldset 3: Event Settings & Logistics (DaisyUI Checkbox Component) */}
            <fieldset className="fieldset bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 gap-3">
              <legend className="fieldset-legend text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Logistics & Coordination Settings
              </legend>
              <div className="space-y-2">
                <label className="label cursor-pointer flex items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <span>Enable Real-time Volunteer Discussion Board (Live Chat)</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="checkbox checkbox-primary checkbox-sm"
                  />
                </label>
                <label className="label cursor-pointer flex items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <span>Distribute safety gear and orientation materials on-site</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="checkbox checkbox-secondary checkbox-sm"
                  />
                </label>
              </div>
            </fieldset>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5"
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Creating Event...</span>
                </>
              ) : (
                <>
                  <CalendarPlus className="w-5 h-5" />
                  <span>Create & Publish Event</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
