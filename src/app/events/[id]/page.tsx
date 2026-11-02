"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { SocialEvent, Attendee } from "../../../types";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";
import EventCountdown from "../../../components/EventCountdown";
import {
  Calendar,
  Home,
  MapPin,
  Tag,
  ArrowLeft,
  CheckCircle2,
  Users,
  CalendarPlus,
  Share2,
  HeartHandshake,
  Clock,
  Flag,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

const eventTypeColors: Record<string, string> = {
  "Donation Drive": "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  "Clean-up": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  "Plantation": "bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800",
  "Healthcare": "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  "Education": "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  "Food Relief": "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  "Disaster Relief": "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800",
  "Other": "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
};

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
  const [activeTab, setActiveTab] = useState<"roadmap" | "volunteers">("roadmap");

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
        if (data.attendee) {
          setAttendees((prev) => [...prev, data.attendee]);
        }
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#059669", "#10b981", "#34d399", "#047857"],
        });
        toast.success("RSVP Confirmed! You're officially registered as a volunteer.");
      } else {
        toast.error(data.message || "Failed to join event.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    const result = await Swal.fire({
      title: "Cancel RSVP?",
      text: "Are you sure you want to withdraw from this volunteer initiative?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Cancel RSVP",
      cancelButtonText: "Stay Joined",
      background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
      color: document.documentElement.classList.contains("dark") ? "#ffffff" : "#0f172a",
    });

    if (result.isConfirmed) {
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
          toast.success("RSVP cancelled.");
        } else {
          toast.error(data.message || "Failed to leave event.");
        }
      } catch {
        toast.error("Failed to cancel RSVP.");
      } finally {
        setJoining(false);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: event?.title,
          text: `Join ${event?.title} on CareSphere!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="skeleton h-96 w-full rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="skeleton h-10 w-3/4 rounded-xl" />
            <div className="skeleton h-32 w-full rounded-2xl" />
          </div>
          <div className="skeleton h-80 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-20 max-w-md mx-auto text-center px-4 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 mx-auto flex items-center justify-center">
          <Tag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Event Not Found</h2>
        <p className="text-sm text-slate-500">
          The event you are looking for does not exist or may have been concluded.
        </p>
        <Link
          href="/upcoming-events"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/25"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Upcoming Events</span>
        </Link>
      </div>
    );
  }

  const badgeStyle =
    eventTypeColors[event.eventType] ||
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm text-slate-500 dark:text-slate-400">
        <ul>
          <li>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/upcoming-events"
              className="hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              Upcoming Events
            </Link>
          </li>
          <li className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">
            {event.title}
          </li>
        </ul>
      </div>

      {/* Main Grid: Details Left, Action Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Event Overview & Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-800 aspect-video max-h-[460px] w-full">
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80";
              }}
            />
            <div className="absolute top-4 left-4 z-10">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-md ${badgeStyle}`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{event.eventType}</span>
              </span>
            </div>
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600/90 text-white text-xs font-bold shadow-md backdrop-blur-md border border-white/20">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>Verified Cause</span>
              </span>
            </div>
          </div>

          {/* Event Header Information */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(event.eventDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{event.location}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {event.title}
            </h1>

            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Organizer Card */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-emerald-500/20">
                  <img
                    src={
                      event.creatorPhoto ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    }
                    alt={event.creatorName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Event Organizer
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {event.creatorName || "Community Changemaker"}
                </p>
                <p className="text-xs text-slate-500">{event.creatorEmail}</p>
              </div>
            </div>
            <span className="badge badge-sm badge-success badge-soft font-semibold hidden sm:inline-flex">
              Verified Host
            </span>
          </div>

          {/* Clean Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab("roadmap")}
              className={`pb-3 px-4 font-bold text-sm inline-flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "roadmap"
                  ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Itinerary & Schedule</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("volunteers")}
              className={`pb-3 px-4 font-bold text-sm inline-flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "volunteers"
                  ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registered Volunteers</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                {attendees.length}
              </span>
            </button>
          </div>

          {/* Tab 1: Itinerary */}
          {activeTab === "roadmap" && (
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Day-of-Event Timeline
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological schedule of operations and volunteer activities
                </p>
              </div>

              <div className="space-y-6 relative border-l-2 border-emerald-500/30 ml-4 pl-6">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                  <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    08:30 AM
                  </p>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    Volunteer Assembly & Check-in
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Assemble at rendezvous point, collect registration badges, safety gloves, and
                    supply packs.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                  <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    09:15 AM
                  </p>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    Logistics & Safety Briefing
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Neighborhood zone assignments, community safety protocols, and team
                    coordinator contacts.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                  <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    10:00 AM
                  </p>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    Active Field Operations
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Hands-on distribution of welfare supplies or planting saplings with community
                    beneficiaries.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                  <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    01:30 PM
                  </p>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    Tally & Impact Verification
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Beneficiary count verification, area clean-up, and return of logistical
                    equipment.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                  <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    03:00 PM
                  </p>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    Debrief & Recognition
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Reflections with organizers, group photo, and logging of digital volunteer
                    service credits.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Registered Volunteers */}
          {activeTab === "volunteers" && (
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Registered Volunteers ({attendees.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Community members who have pledged to participate in this initiative
                </p>
              </div>

              {attendees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {attendees.map((attendee, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center gap-3"
                    >
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald-500/20 shrink-0">
                          <img
                            src={
                              attendee.userPhoto ||
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                            }
                            alt={attendee.userName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {attendee.userName}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{attendee.userEmail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-2">
                  <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No volunteers registered yet
                  </p>
                  <p className="text-xs text-slate-500">
                    Be the first to join this community initiative!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Join Action Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
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

            {/* Countdown Component */}
            <div className="pt-2">
              <EventCountdown targetDate={event.eventDate} />
            </div>

            {/* Quota Progress */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Volunteer Mobilization</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {attendeesCount} / {Math.max(attendeesCount, 25)}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((attendeesCount / Math.max(attendeesCount, 25)) * 100)
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400 text-right">
                {Math.max(0, 25 - attendeesCount)} spots available
              </p>
            </div>

            {/* Action Buttons */}
            {isJoined ? (
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      You&apos;re Attending!
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                      RSVP confirmed in CareSphere registry.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLeaveEvent}
                  disabled={joining}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                >
                  Cancel My RSVP
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleJoinEvent}
                  disabled={joining}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                >
                  {joining ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      <span>Confirming RSVP...</span>
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="w-5 h-5" />
                      <span>Join as Volunteer</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Social Share & Calendar Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Event</span>
              </button>

              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                  event.title
                )}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(
                  event.location
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Add to Calendar</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}