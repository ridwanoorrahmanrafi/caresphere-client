"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { SocialEvent, Attendee } from "../../../types";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import {
  Calendar,
  MapPin,
  Tag,
  ArrowLeft,
  CheckCircle2,
  Users,
  CalendarPlus,
  Share2,
  Loader2,
  AlertCircle,
  HeartHandshake,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const { user, authFetch } = useAuth();
  const router = useRouter();

  const [event, setEvent] = useState<SocialEvent | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [attendeesCount, setAttendeesCount] = useState(0);
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await authFetch(`${API_BASE_URL}/events/${eventId}`);
      const data = await res.json();
      if (data.success && data.event) {
        setEvent(data.event);
        setAttendees(data.attendees || []);
        setAttendeesCount(data.attendeesCount || 0);
        setIsJoined(data.isUserJoined || false);
      } else {
        toast.error(data.message || "Event not found");
      }
    } catch (err) {
      console.error("Error fetching event details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId, user]);

  const handleJoinEvent = async () => {
    if (!user) {
      toast("Please log in to join this social service event as a volunteer.", {
        icon: "🔐",
      });
      router.push("/login");
      return;
    }

    try {
      setJoining(true);
      const res = await authFetch(`${API_BASE_URL}/events/${eventId}/join`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        setIsJoined(true);
        setAttendeesCount((prev) => prev + 1);
        if (data.joinRecord) {
          setAttendees((prev) => [
            ...prev,
            {
              userName: user.name,
              userEmail: user.email,
              userPhoto: user.photoURL,
              joinedAt: new Date().toISOString(),
            },
          ]);
        }
        // Celebration confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        toast.success(data.message || "You have successfully joined as a volunteer!");
      } else {
        toast.error(data.message || "Could not join event.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!confirm("Are you sure you want to cancel your volunteer RSVP for this event?")) return;

    try {
      setJoining(true);
      const res = await authFetch(`${API_BASE_URL}/events/${eventId}/leave`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setIsJoined(false);
        setAttendeesCount((prev) => Math.max(0, prev - 1));
        setAttendees((prev) => prev.filter((a) => a.userEmail !== user?.email));
        toast.success(data.message || "RSVP cancelled.");
      } else {
        toast.error(data.message || "Could not cancel RSVP.");
      }
    } catch {
      toast.error("Failed to cancel RSVP.");
    } finally {
      setJoining(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="py-20 max-w-5xl mx-auto px-4 space-y-6 animate-pulse">
        <div className="h-8 w-40 rounded skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
        <div className="w-full h-80 sm:h-96 rounded-3xl skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
        <div className="h-10 w-3/4 rounded skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
        <div className="h-24 w-full rounded skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4 px-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Event Not Found</h2>
        <p className="text-sm text-slate-500">
          The event you are looking for may have been removed or does not exist.
        </p>
        <Link
          href="/upcoming-events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Upcoming Events</span>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back navigation */}
      <div>
        <Link
          href="/upcoming-events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Upcoming Events</span>
        </Link>
      </div>

      {/* Main Grid: Details + Join Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Event Hero Image & In-Depth Information */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Visual Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 h-80 sm:h-96">
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80";
              }}
            />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-300 backdrop-blur-md shadow-sm border border-white/20">
                <Tag className="w-3.5 h-3.5" />
                {event.eventType}
              </span>
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-300 py-3 border-y border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium">{attendeesCount} Registered Volunteers</span>
              </div>
            </div>
          </div>

          {/* Description Body */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">About This Event</h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Organizer Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Event Organizer
            </h3>
            <div className="flex items-center gap-4">
              <img
                src={event.creatorPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt={event.creatorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/50"
              />
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {event.creatorName || "Community Changemaker"}
                </p>
                <p className="text-xs text-slate-500">{event.creatorEmail}</p>
              </div>
            </div>
          </div>

          {/* Registered Volunteers list */}
          {attendees.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Volunteers Who Have Joined ({attendees.length})</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {attendees.map((attendee, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-2.5"
                  >
                    <img
                      src={attendee.userPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                      alt={attendee.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {attendee.userName}
                      </p>
                      <p className="text-[10px] text-slate-400">Volunteer</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Join Action Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <div className="p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Volunteer Registration
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  Join as Volunteer
                </p>
                <p className="text-xs text-slate-500">
                  Free admission. Bring your energy and positive mindset!
                </p>
              </div>

              {/* Status or Join Button */}
              {isJoined ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                        You&apos;re Attending!
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Your RSVP has been confirmed in the database.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLeaveEvent}
                    disabled={joining}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900 transition-colors"
                  >
                    Cancel My RSVP
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleJoinEvent}
                  disabled={joining}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5"
                >
                  {joining ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Confirming RSVP...</span>
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="w-5 h-5" />
                      <span>Join Event</span>
                    </>
                  )}
                </button>
              )}

              {/* Share & Add to Calendar Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Event</span>
                </button>

                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    event.title
                  )}&details=${encodeURIComponent(
                    event.description
                  )}&location=${encodeURIComponent(event.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Add to Calendar</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
