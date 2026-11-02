"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { JoinedEvent } from "../../types";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Home,
  CalendarCheck,
  Calendar,
  MapPin,
  ExternalLink,
  Trash2,
  CalendarDays,
  ArrowRight,
  Tag,
  LayoutList,
  LayoutGrid,
  Filter,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

export default function JoinedEventsPage() {
  const { user, authFetch } = useAuth();
  const [joinedEvents, setJoinedEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const availableTypes = Array.from(new Set(joinedEvents.map((j) => j.eventType))).filter(Boolean);
  const filteredJoinedEvents = selectedTypes.length === 0
    ? joinedEvents
    : joinedEvents.filter((j) => selectedTypes.includes(j.eventType));

  const fetchJoinedEvents = async () => {
    try {
      setLoading(true);
      // Requirement: Show all events joined by the logged-in user, sorted by event date
      const res = await authFetch(`${API_BASE_URL}/events/joined`);
      const data = await res.json();
      if (data.success && Array.isArray(data.joinedEvents)) {
        setJoinedEvents(data.joinedEvents);
      } else {
        setJoinedEvents([]);
      }
    } catch (err) {
      console.error("Failed to fetch joined events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJoinedEvents();
    }
  }, [user]);

  const handleCancelRsvp = async (eventId: string, title: string) => {
    const result = await Swal.fire({
      title: "Cancel RSVP?",
      text: `Do you want to withdraw your attendance for "${title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Cancel RSVP",
      cancelButtonText: "Keep RSVP",
      background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
      color: document.documentElement.classList.contains("dark") ? "#ffffff" : "#0f172a",
    });

    if (result.isConfirmed) {
      try {
        const res = await authFetch(`${API_BASE_URL}/events/${eventId}/leave`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success) {
          toast.success(data.message || "RSVP cancelled.");
          setJoinedEvents((prev) => prev.filter((e) => e.eventId !== eventId));
        } else {
          toast.error(data.message || "Could not cancel RSVP.");
        }
      } catch {
        toast.error("Failed to cancel RSVP.");
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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
              Joined Events
            </li>
          </ul>
        </div>

        {/* Page Header with DaisyUI List / Grid Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Volunteer Dashboard</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Events You Have Joined
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing all volunteer commitments sorted by upcoming event date
            </p>
          </div>

          {joinedEvents.length > 0 && (
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "list"
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
            </div>
          )}
        </div>

        {/* DaisyUI Filter Component (HTML Form with Checkboxes and Reset Button) */}
        {!loading && availableTypes.length > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Multi-Filter:
              </span>
            </div>

            <form
              className="filter flex-wrap"
              onReset={(e) => {
                e.preventDefault();
                setSelectedTypes([]);
              }}
            >
              {availableTypes.map((type) => (
                <input
                  key={type}
                  className="btn btn-xs sm:btn-sm btn-outline text-xs"
                  type="checkbox"
                  name="joined-types"
                  checked={selectedTypes.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTypes((prev) => [...prev, type]);
                    } else {
                      setSelectedTypes((prev) => prev.filter((t) => t !== type));
                    }
                  }}
                  aria-label={type}
                />
              ))}
              <input
                className="btn btn-square btn-xs sm:btn-sm border-slate-300 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                type="reset"
                value="×"
                title="Reset Category Selection"
              />
            </form>
          </div>
        )}

        {/* DaisyUI Stack Component: Next Immediate Commitment Deck */}
        {!loading && joinedEvents.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <span className="badge badge-sm badge-success font-bold uppercase tracking-wider">
                Immediate Next Drive
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {joinedEvents[0]?.eventTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scheduled for {new Date(joinedEvents[0]?.eventDate).toLocaleDateString()} at {joinedEvents[0]?.eventLocation}
              </p>
            </div>

            {/* Stacked Cards Preview Deck with DaisyUI Stack & Card */}
            <div className="stack stack-bottom w-64 shrink-0">
              <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-3 rounded-2xl flex flex-row items-center gap-3">
                <img
                  src={joinedEvents[0]?.thumbnail}
                  alt={joinedEvents[0]?.eventTitle}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate text-slate-900 dark:text-white">
                    {joinedEvents[0]?.eventTitle}
                  </p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Priority Commitment #1</span>
                </div>
              </div>
              <div className="card bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow p-3 rounded-2xl h-16"></div>
              <div className="card bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shadow-sm p-3 rounded-2xl h-16"></div>
            </div>
          </div>
        )}

        {/* Joined Events List / Cards */}
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 py-6">
              <span className="loading loading-ring loading-md text-primary" />
              <span className="skeleton skeleton-text text-sm font-semibold">
                Retrieving your joined volunteer initiatives...
              </span>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="skeleton h-28 w-full rounded-2xl"
              />
            ))}
          </div>
        ) : joinedEvents.length > 0 ? (
          viewMode === "list" ? (
            /* DaisyUI List Component */
            <ul className="list bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <li className="p-4 px-6 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>My Volunteer Commitments ({filteredJoinedEvents.length})</span>
                <span className="text-[11px] font-normal normal-case text-slate-500">Sorted by upcoming event date</span>
              </li>

              {filteredJoinedEvents.map((joined) => (
                <li key={joined._id} className="list-row hover:bg-slate-50/70 dark:hover:bg-slate-800/40 py-4 px-6">
                  {/* Column 1: Event Thumbnail */}
                  <div>
                    <img
                      src={joined.thumbnail}
                      alt={joined.eventTitle}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=200&q=80";
                      }}
                    />
                  </div>

                  {/* Column 2: Event Title & Meta (list-col-grow) */}
                  <div className="list-col-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="badge badge-xs badge-soft badge-primary font-bold">
                        {joined.eventType}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="status status-xs status-success" />
                        <span>Confirmed RSVP</span>
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {joined.eventDate}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                      {joined.eventTitle}
                    </h3>
                  </div>

                  {/* Column 3: Location details wrapped with list-col-wrap */}
                  <p className="list-col-wrap text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pl-0 sm:pl-18">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{joined.eventLocation}</span>
                  </p>

                  {/* Column 3.5: Attendance Progress (DaisyUI Progress Component) */}
                  <div className="hidden lg:flex flex-col gap-1 w-28 shrink-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">RSVP Confirmed</span>
                    <progress className="progress progress-success w-full h-1.5" value="100" max="100"></progress>
                  </div>

                  {/* Column 4: Public Page Link Action */}
                  <Link
                    href={`/events/${joined.eventId}`}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors shrink-0"
                    title="View Event Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {/* Column 5: Cancel RSVP Action */}
                  <button
                    onClick={() => handleCancelRsvp(joined.eventId, joined.eventTitle)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                    title="Cancel RSVP"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            /* Card Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJoinedEvents.map((joined) => (
              <div
                key={joined._id}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative w-full h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={joined.thumbnail}
                      alt={joined.eventTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-300 backdrop-blur-md shadow-sm border border-white/20">
                        <Tag className="w-3 h-3" />
                        {joined.eventType}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-300 backdrop-blur-md shadow-sm border border-white/20">
                        <span className="status status-xs status-success" />
                        <span>Confirmed</span>
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{joined.eventDate}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                      {joined.eventTitle}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{joined.eventLocation}</span>
                    </div>

                    {/* RSVP Milestone Progress (DaisyUI Progress Component) */}
                    <div className="pt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                        <span>RSVP Status</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Confirmed</span>
                      </div>
                      <progress className="progress progress-success w-full h-1.5" value="100" max="100"></progress>
                    </div>
                  </div>
                </div>

                {/* DaisyUI Divider Component */}
                <div className="divider my-0 px-5"></div>

                {/* Bottom Actions */}
                <div className="p-5 pt-0 flex items-center justify-between gap-3">
                  <Link
                    href={`/events/${joined.eventId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>View Event Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleCancelRsvp(joined.eventId, joined.eventTitle)}
                    className="p-2 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors"
                    title="Cancel RSVP"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 max-w-xl mx-auto space-y-4">
            <CalendarDays className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No Joined Events Yet
            </h3>
            <p className="text-sm text-slate-500">
              You haven&apos;t joined any social development events yet. Browse upcoming events and
              RSVP to participate!
            </p>
            <Link
              href="/upcoming-events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              <span>Explore Upcoming Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
