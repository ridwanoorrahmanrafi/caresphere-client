"use client";

import React, { useEffect, useState, Suspense } from "react";
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
  AlertCircle,
  HeartHandshake,
  MessageSquare,
  Send,
  Clock,
  Flag,
  X,
} from "lucide-react";

interface ChatMessage {
  id: string;
  senderName: string;
  senderPhoto: string;
  message: string;
  time: string;
  alignment: "chat-start" | "chat-end";
  colorClass: string;
  status?: string;
}

import { API_BASE_URL } from "@/config/api";

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
  const [activeTab, setActiveTab] = useState<"roadmap" | "volunteers" | "chat">("roadmap");

  // DaisyUI Chat Bubble Discussion Board State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderName: "Tanvir Ahmed (Organizer)",
      senderPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      message: "Welcome volunteers! Please arrive 15 minutes before the start time. Refreshments and essential gear will be provided on-site.",
      time: "10:15 AM",
      alignment: "chat-start",
      colorClass: "chat-bubble-primary",
      status: "Delivered",
    },
    {
      id: "2",
      senderName: "Sumaiya Akter (Volunteer)",
      senderPhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      message: "Should our team bring extra gloves or supply boxes, or is everything already prepared at the collection point?",
      time: "10:30 AM",
      alignment: "chat-end",
      colorClass: "chat-bubble-accent",
      status: "Seen at 10:31",
    },
    {
      id: "3",
      senderName: "Tanvir Ahmed (Organizer)",
      senderPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      message: "Heavy-duty gloves and distribution crates are fully provided! Just bring your water bottle and personal identification.",
      time: "10:35 AM",
      alignment: "chat-start",
      colorClass: "chat-bubble-secondary",
      status: "Delivered",
    },
  ]);
  const [newChatMessage, setNewChatMessage] = useState("");

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    if (!user) {
      toast("Please log in to post on the volunteer coordination board.", {
        icon: "🔐",
      });
      router.push("/login");
      return;
    }

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderName: user.name || "Volunteer",
      senderPhoto: user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      message: newChatMessage.trim(),
      time: "Just now",
      alignment: "chat-end",
      colorClass: "chat-bubble-success",
      status: "Sent",
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewChatMessage("");
    toast.success("Message posted to coordination board!");
  };

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
    const result = await Swal.fire({
      title: "Cancel RSVP?",
      text: "Are you sure you want to cancel your volunteer RSVP for this event?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Cancel RSVP",
      cancelButtonText: "Keep RSVP",
      background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
      color: document.documentElement.classList.contains("dark") ? "#ffffff" : "#0f172a",
    });

    if (!result.isConfirmed) return;

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
      <div className="py-20 max-w-5xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-center py-4">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="loading loading-spinner loading-md text-primary" />
            <span className="skeleton skeleton-text text-sm font-semibold">
              Loading Event Details...
            </span>
            <span className="loading loading-dots loading-xs text-secondary" />
          </div>
        </div>
        <div className="skeleton h-8 w-40 rounded-xl" />
        <div className="skeleton w-full h-80 sm:h-96 rounded-3xl" />
        <div className="skeleton h-10 w-3/4 rounded-xl" />
        <div className="skeleton h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-24 max-w-md mx-auto px-4">
        <div role="alert" className="alert alert-error alert-soft alert-vertical shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 shrink-0 mx-auto" />
          <div>
            <h2 className="text-xl font-bold">Event Not Found</h2>
            <p className="text-xs opacity-90 mt-1">
              The event you are looking for may have been removed or does not exist.
            </p>
          </div>
          <Link
            href="/upcoming-events"
            className="btn btn-sm btn-primary inline-flex items-center gap-2 mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Upcoming Events</span>
          </Link>
        </div>
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
    <div className="drawer drawer-end">
      {/* DaisyUI Drawer Toggle for Volunteer Roster */}
      <input id="volunteer-roster-drawer" type="checkbox" className="drawer-toggle" />

      {/* DaisyUI Drawer Content */}
      <div className="drawer-content py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* DaisyUI Breadcrumbs Component */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="breadcrumbs text-sm text-slate-500 dark:text-slate-400">
          <ul>
            <li>
              <Link href="/" className="inline-flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/upcoming-events" className="inline-flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <Calendar className="w-4 h-4" />
                <span>Upcoming Events</span>
              </Link>
            </li>
            <li className="font-semibold text-slate-900 dark:text-white max-w-xs sm:max-w-md truncate">
              {event.title}
            </li>
          </ul>
        </div>

        <Link
          href="/upcoming-events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Events</span>
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

            <div className="flex flex-wrap items-center text-sm text-slate-600 dark:text-slate-300 py-3 border-y border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="divider divider-horizontal mx-3 my-0 h-4"></div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium">{event.location}</span>
              </div>
              <div className="divider divider-horizontal mx-3 my-0 h-4"></div>
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

          {/* DaisyUI Divider Component with Placement Modifier (divider-start) */}
          <div className="divider divider-start text-xs font-bold uppercase tracking-wider text-slate-400">
            Host & Leadership
          </div>

          {/* Organizer Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Event Organizer
            </h3>
            <div className="flex items-center gap-4">
              <div className="avatar avatar-online">
                <div className="w-12 h-12 rounded-full ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900">
                  <img
                    src={event.creatorPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                    alt={event.creatorName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {event.creatorName || "Community Changemaker"}
                </p>
                <p className="text-xs text-slate-500">{event.creatorEmail}</p>
              </div>
            </div>
          </div>

          {/* DaisyUI Tabs Component (tabs-lift tabs-md) */}
          <div role="tablist" className="tabs tabs-lift tabs-md w-full pt-4">
            <button
              type="button"
              role="tab"
              onClick={() => setActiveTab("roadmap")}
              className={`tab gap-2 font-semibold ${
                activeTab === "roadmap"
                  ? "tab-active font-bold text-emerald-600 dark:text-emerald-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Itinerary & Roadmap</span>
            </button>

            <button
              type="button"
              role="tab"
              onClick={() => setActiveTab("volunteers")}
              className={`indicator tab gap-2 font-semibold ${
                activeTab === "volunteers"
                  ? "tab-active font-bold text-emerald-600 dark:text-emerald-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Volunteers</span>
              <span className="indicator-item badge badge-xs badge-primary font-bold">
                {attendees.length}
              </span>
            </button>

            <button
              type="button"
              role="tab"
              onClick={() => setActiveTab("chat")}
              className={`indicator tab gap-2 font-semibold ${
                activeTab === "chat"
                  ? "tab-active font-bold text-emerald-600 dark:text-emerald-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Live Coordination</span>
              <span className="indicator-item badge badge-xs badge-success animate-pulse font-bold">
                Live
              </span>
            </button>
          </div>

          {/* Tab Content 1: Itinerary & Roadmap */}
          {activeTab === "roadmap" && (
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Day-of-Event Timeline & Roadmap</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chronological schedule of volunteer operations and field activities
                  </p>
                </div>
                <span className="badge badge-sm badge-soft badge-primary font-semibold">
                  Itinerary
                </span>
              </div>

              <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                <li>
                  <div className="timeline-middle">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="timeline-start mb-8 md:text-end">
                    <time className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">08:30 AM</time>
                    <div className="text-base font-bold text-slate-900 dark:text-white">Volunteer Assembly & Check-in</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Assemble at rendezvous point, collect registration badges, safety gloves, and supply packs.
                    </p>
                  </div>
                  <hr className="bg-emerald-600" />
                </li>
                <li>
                  <hr className="bg-emerald-600" />
                  <div className="timeline-middle">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="timeline-end mb-8">
                    <time className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">09:15 AM</time>
                    <div className="text-base font-bold text-slate-900 dark:text-white">Logistics & Safety Briefing</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Neighborhood zone assignments, community protocols, and emergency coordinator contacts.
                    </p>
                  </div>
                  <hr className="bg-emerald-600" />
                </li>
                <li>
                  <hr className="bg-emerald-600" />
                  <div className="timeline-middle">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="timeline-start mb-8 md:text-end">
                    <time className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">10:00 AM</time>
                    <div className="text-base font-bold text-slate-900 dark:text-white">Active Field Operations</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Hands-on distribution of welfare supplies or planting saplings with community beneficiaries.
                    </p>
                  </div>
                  <hr className="bg-emerald-600" />
                </li>
                <li>
                  <hr className="bg-emerald-600" />
                  <div className="timeline-middle">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="timeline-end mb-8">
                    <time className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">01:30 PM</time>
                    <div className="text-base font-bold text-slate-900 dark:text-white">Tally & Impact Verification</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Beneficiary count verification, area clean-up, and return of logistical equipment.
                    </p>
                  </div>
                  <hr />
                </li>
                <li>
                  <hr />
                  <div className="timeline-middle">
                    <Flag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="timeline-start md:text-end">
                    <time className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">03:00 PM</time>
                    <div className="text-base font-bold text-slate-900 dark:text-white">Debrief & Recognition</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Reflections with organizers, group photo, and logging of digital volunteer service credits.
                    </p>
                  </div>
                  <hr />
                </li>
              </ul>
            </div>
          )}

          {/* Tab Content 2: Registered Volunteers */}
          {activeTab === "volunteers" && (
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Volunteers Who Have Joined ({attendees.length})</span>
                </h3>

                <div className="flex items-center gap-3">
                  <label
                    htmlFor="volunteer-roster-drawer"
                    className="btn btn-xs sm:btn-sm btn-outline btn-primary drawer-button flex items-center gap-1.5 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Open Roster Drawer</span>
                  </label>

                  {attendees.length > 0 && (
                    <div className="avatar-group -space-x-3">
                    {attendees.slice(0, 5).map((a, i) => (
                      <div key={i} className="avatar">
                        <div className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-slate-900">
                          <img src={a.userPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} alt={a.userName} />
                        </div>
                      </div>
                    ))}
                    {attendees.length > 5 && (
                      <div className="avatar avatar-placeholder">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white text-[11px] font-bold ring-2 ring-white dark:ring-slate-900">
                          <span>+{attendees.length - 5}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                </div>
              </div>

              {attendees.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {attendees.map((attendee, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-2.5"
                    >
                      <div className="avatar">
                        <div className="w-8 h-8 rounded-full">
                          <img
                            src={attendee.userPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                            alt={attendee.userName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {attendee.userName}
                        </p>
                        <p className="text-[10px] text-slate-400">Volunteer</p>
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

          {/* Tab Content 3: Volunteer Discussion & Coordination Board (DaisyUI Window Mockup) */}
          {activeTab === "chat" && (
            <div className="mockup-window border border-base-300 bg-base-100 shadow-sm animate-in fade-in duration-200">
              <div className="border-t border-base-300 p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Volunteer Discussion & Coordination</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time logistical communication between organizers and attendees
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/50">
                  <div className="status-ping-wrapper">
                    <div aria-label="status" className="status status-xs status-success animate-ping"></div>
                    <div aria-label="status" className="status status-xs status-success"></div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    Live Board
                  </span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-3 py-1">
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat ${msg.alignment}`}>
                    <div className="chat-image avatar">
                      <div className="w-10 h-10 rounded-full ring-2 ring-emerald-500/30">
                        <img
                          src={msg.senderPhoto}
                          alt={msg.senderName}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
                          }}
                        />
                      </div>
                    </div>
                    <div className="chat-header text-slate-600 dark:text-slate-300 font-medium">
                      <span className="font-bold text-slate-900 dark:text-white">{msg.senderName}</span>
                      <time className="text-[11px] opacity-60 ml-1.5">{msg.time}</time>
                    </div>
                    <div className={`chat-bubble ${msg.colorClass}`}>
                      {msg.message}
                    </div>
                    {msg.status && (
                      <div className="chat-footer opacity-75 text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="status status-xs status-success"></span>
                        <span>{msg.status}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Interactive Chat Input with DaisyUI Join & Textarea Components */}
              <form onSubmit={handleSendChatMessage} className="pt-2 space-y-2">
                <div className="join w-full">
                  <textarea
                    rows={2}
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    placeholder={
                      user
                        ? "Ask a question or leave a coordination note for volunteers..."
                        : "Please sign in to post a question for the organizer..."
                    }
                    className="textarea textarea-sm textarea-primary join-item flex-1 min-h-[3rem] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendChatMessage(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary join-item h-auto px-5 gap-2 shrink-0 font-bold"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Post</span>
                  </button>
                </div>

                {/* DaisyUI File Input (Ghost & Extra-Small size) for attaching field photo */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pl-1">
                  <span className="font-semibold text-[11px] text-slate-400">Attach field photo or document:</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-ghost file-input-xs max-w-xs"
                    title="Upload volunteer field photo"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        toast.success(`Attached "${e.target.files[0].name}"`);
                      }
                    }}
                  />
                </div>
              </form>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Join Action Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            {/* DaisyUI Aura Glow Wrapper */}
            <div className="aura aura-glow rounded-3xl">
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

                {/* DaisyUI Divider Component */}
                <div className="divider my-1"></div>

                {/* DaisyUI Countdown Component */}
                <div>
                  <EventCountdown targetDate={event.eventDate} />
                </div>

                {/* DaisyUI Divider Component with Primary Color */}
                <div className="divider divider-primary my-1 text-xs font-semibold text-slate-400">
                  Target Quota
                </div>

                {/* Volunteer Mobilization Goal (DaisyUI Radial Progress & Progress Component) */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                    <div
                      className="radial-progress text-primary font-bold text-xs"
                      style={{
                        "--value": Math.min(100, Math.round((attendeesCount / Math.max(attendeesCount, 25)) * 100)),
                        "--size": "3.25rem",
                        "--thickness": "3.5px",
                      } as React.CSSProperties}
                      role="progressbar"
                      aria-valuenow={Math.min(100, Math.round((attendeesCount / Math.max(attendeesCount, 25)) * 100))}
                    >
                      {Math.min(100, Math.round((attendeesCount / Math.max(attendeesCount, 25)) * 100))}%
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block truncate">
                        Recruitment Quota
                      </span>
                      <p className="text-[11px] text-slate-500 truncate">
                        {attendeesCount} of {Math.max(attendeesCount, 25)} volunteers confirmed
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {joining ? (
                      <progress className="progress progress-primary w-full h-1.5"></progress>
                    ) : (
                      <progress
                        className="progress progress-primary w-full h-1.5"
                        value={attendeesCount}
                        max={Math.max(attendeesCount, 25)}
                      ></progress>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{Math.max(0, 25 - attendeesCount)} spots available</span>
                      <span>Target: 25 volunteers</span>
                    </div>
                  </div>
                </div>

                {/* Status or Join Button */}
                {isJoined ? (
                  <div className="space-y-3">
                    <div role="alert" className="alert alert-success alert-soft">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-sm font-bold">
                          You&apos;re Attending!
                        </p>
                        <p className="text-xs opacity-90">
                          Your RSVP has been confirmed in the CareSphere registry.
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
                  <div className="space-y-3">
                    <label className="label cursor-pointer flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="checkbox checkbox-primary checkbox-xs"
                      />
                      <span>I agree to attend orientation & adhere to safety rules</span>
                    </label>

                    <button
                      onClick={handleJoinEvent}
                      disabled={joining}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5"
                    >
                      {joining ? (
                        <>
                          <span className="loading loading-spinner loading-sm" />
                          <span>Confirming RSVP...</span>
                        </>
                      ) : (
                        <>
                          <HeartHandshake className="w-5 h-5" />
                          <span>Join Event</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Share, Add to Calendar, and Drawer Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>

                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                      event.title
                    )}&details=${encodeURIComponent(
                      event.description
                    )}&location=${encodeURIComponent(event.location)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Calendar</span>
                  </a>

                  <label
                    htmlFor="volunteer-roster-drawer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Roster</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* DaisyUI Drawer Side (drawer-end: Opens from Right) */}
      <div className="drawer-side z-1002">
        <label
          htmlFor="volunteer-roster-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <aside className="p-6 w-80 sm:w-96 min-h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
          <div className="space-y-5">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  <Users className="w-3 h-3" />
                  <span>Volunteer Roster</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Event Attendees ({attendees.length})
                </h3>
              </div>
              <label
                htmlFor="volunteer-roster-drawer"
                className="btn btn-ghost btn-circle btn-sm cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </label>
            </div>

            {/* Attendees List in Drawer */}
            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {attendees.length > 0 ? (
                attendees.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="avatar">
                        <div className="w-9 h-9 rounded-full ring-2 ring-emerald-500/60">
                          <img
                            src={a.userPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                            alt={a.userName}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {a.userName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{a.userEmail}</p>
                      </div>
                    </div>
                    <span className="badge badge-xs badge-success badge-soft shrink-0">RSVP Confirmed</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-xs text-slate-400">
                  No volunteers registered yet.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label
              htmlFor="volunteer-roster-drawer"
              className="btn btn-sm btn-outline w-full cursor-pointer"
            >
              Close Roster Drawer
            </label>
          </div>
        </aside>
      </div>
    </div>
  );
}
