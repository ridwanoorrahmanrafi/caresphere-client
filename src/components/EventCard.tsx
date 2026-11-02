"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SocialEvent } from "../types";
import { Calendar, MapPin, ArrowRight, Tag } from "lucide-react";

interface EventCardProps {
  event: SocialEvent;
}

// Supplementary angle/progress photos for the DaisyUI Hover Gallery
const eventGalleryImages: Record<string, string[]> = {
  "Donation Drive": [
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=700&q=80",
  ],
  "Clean-up": [
    "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=700&q=80",
  ],
  "Plantation": [
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80",
  ],
  "Healthcare": [
    "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80",
  ],
  "Education": [
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80",
  ],
  "Food Relief": [
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=700&q=80",
  ],
};

// Color badges for different event types
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

export default function EventCard({ event }: EventCardProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const badgeStyle =
    eventTypeColors[event.eventType] ||
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";

  // Deterministic recruitment progress percentage based on event ID
  const recruitmentProgress = React.useMemo(() => {
    if (!event._id) return 70;
    const charCode = event._id.charCodeAt(event._id.length - 1) || 5;
    return (charCode % 40) + 55;
  }, [event._id]);

  // Build list of 3 images for the DaisyUI Hover Gallery
  const fallbackList = eventGalleryImages[event.eventType] || [
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=700&q=80",
  ];
  const galleryImages = [event.thumbnail, fallbackList[1] || fallbackList[0], fallbackList[2] || fallbackList[0]];

  return (
    <div className="indicator w-full h-full">
      {/* DaisyUI Indicator Item: Verified Cause Badge */}
      <span className="indicator-item indicator-top indicator-end badge badge-success badge-sm shadow-md font-bold z-20">
        Verified
      </span>
      <div className="card card-border group rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full w-full">
      {/* DaisyUI Hover Gallery in a Card */}
      <figure
        className="hover-gallery relative w-full h-52 overflow-hidden bg-slate-100 dark:bg-slate-800 m-0"
        onMouseLeave={() => setActiveIdx(0)}
      >
        {galleryImages.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`${event.title} - view ${idx + 1}`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              activeIdx === idx ? "active opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80";
            }}
          />
        ))}

        {/* Hover detection columns for the Hover Gallery */}
        <div className="hover-gallery-track">
          {galleryImages.map((_, idx) => (
            <div
              key={idx}
              className="hover-gallery-col"
              onMouseEnter={() => setActiveIdx(idx)}
              title={`Hover horizontally to preview photo ${idx + 1}`}
            />
          ))}
        </div>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 pointer-events-none px-2 py-0.5 rounded-full bg-slate-950/40 backdrop-blur-sm">
          {galleryImages.map((_, idx) => (
            <span
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                activeIdx === idx ? "bg-white w-3" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Floating Category Badge (DaisyUI Badge Component) */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <span
            className={`badge badge-sm border backdrop-blur-md shadow-sm ${badgeStyle}`}
          >
            <Tag className="w-3 h-3" />
            {event.eventType}
          </span>
        </div>

        {/* Floating Status Indicator (DaisyUI Status Component) */}
        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/75 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold shadow-sm">
            <div className="status-ping-wrapper">
              <div aria-label="active status" className="status status-xs status-success animate-ping"></div>
              <div aria-label="active status" className="status status-xs status-success"></div>
            </div>
            <span>Upcoming</span>
          </div>
        </div>
      </figure>

      {/* Card Content (DaisyUI card-body) */}
      <div className="card-body p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Event Date */}
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2.5">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{formattedDate}</span>
          </div>

          {/* Title (DaisyUI card-title) */}
          <h3 className="card-title text-lg font-bold text-slate-900 dark:text-slate-50 line-clamp-2 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          {/* Short description excerpt */}
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
            {event.description}
          </p>

          {/* Volunteer Mobilization Progress (DaisyUI Progress Component) */}
          <div className="pt-2 mb-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span>Recruitment Target</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{recruitmentProgress}% Mobilized</span>
            </div>
            <progress
              className="progress progress-primary w-full h-1.5"
              value={recruitmentProgress}
              max={100}
            ></progress>
          </div>
        </div>

        {/* View Event Button (DaisyUI card-actions) */}
        <div className="card-actions mt-auto">
          <Link
            href={`/events/${event._id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 group-hover:-translate-y-0.5"
          >
            <span>View Event</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}

