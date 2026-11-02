"use client";

import React, { useState, useRef } from "react";
import { Camera, LayoutGrid, Sliders, ChevronLeft, ChevronRight, Columns2, Sparkles } from "lucide-react";

const galleryItems = [
  {
    title: "Winter Relief Distribution",
    location: "Mirpur 10, Dhaka",
    category: "Donation",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Blanket Drive for Needy",
    location: "Mohammadpur, Dhaka",
    category: "Welfare",
    imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Dhanmondi Lake Clean-Up",
    location: "Dhanmondi, Dhaka",
    category: "Environment",
    imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Diabari Tree Plantation",
    location: "Uttara, Dhaka",
    category: "Greening",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Free Healthcare & Eye Camp",
    location: "Lalbagh, Old Dhaka",
    category: "Medical",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Education & Book Drive",
    location: "Korail, Mohakhali",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80",
  },
];

const diffShowcases = [
  {
    title: "Dhanmondi Lake Clean-Up Drive",
    location: "Dhanmondi, Dhaka",
    stats: "1.2 Tons of Plastic Cleared • 120 Volunteers Mobilized",
    beforeImage:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80",
    beforeLabel: "Before: Severe Plastic & Debris Pollution",
    afterImage:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    afterLabel: "After: Cleaned Waterfront & Green Parkway",
  },
  {
    title: "Community Tree Plantation & Urban Greening",
    location: "Mirpur 10 School Yard, Dhaka",
    stats: "250 Fruit & Shade Trees Planted • 65 Youth Volunteers",
    beforeImage:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    beforeLabel: "Before: Barren Dry Soil Ground",
    afterImage:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
    afterLabel: "After: Thriving Youth Woodland Garden",
  },
];

export default function Gallery() {
  const [viewMode, setViewMode] = useState<"grid" | "carousel" | "diff">("grid");
  const [diffPos, setDiffPos] = useState<number>(50);
  const [activeDiffIndex, setActiveDiffIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const itemWidth = 360;
      carouselRef.current.scrollTo({ left: index * itemWidth, behavior: "smooth" });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setDiffPos(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
      const percent = Math.round((x / rect.width) * 100);
      setDiffPos(percent);
    }
  };

  const currentDiff = diffShowcases[activeDiffIndex];

  return (
    <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <Camera className="w-3.5 h-3.5" />
              <span>Community Action Gallery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Moments of Empathy in Action
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              A glimpse into the real change brought by our dedicated volunteers across winter aid,
              environmental cleanliness, and healthcare programs.
            </p>
          </div>

          {/* DaisyUI Mode Toggles: Grid vs Carousel vs Diff */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode("carousel")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "carousel"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Carousel Slider</span>
            </button>
            <button
              onClick={() => setViewMode("diff")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "diff"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Before &amp; After (Diff)</span>
            </button>
          </div>
        </div>

        {/* 1. Grid View (DaisyUI Cards) */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                className="card card-border group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800 h-64 bg-slate-200 dark:bg-slate-800"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="badge badge-xs badge-success mb-1.5 font-bold uppercase tracking-wider backdrop-blur-sm">
                    {item.category}
                  </span>
                  <h4 className="text-base font-bold drop-shadow-sm line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. DaisyUI Carousel View */}
        {viewMode === "carousel" && (
          <div className="space-y-4">
            <div className="relative group">
              {/* Carousel Container */}
              <div
                ref={carouselRef}
                className="carousel carousel-center rounded-3xl w-full space-x-5 p-4 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-inner"
              >
                {galleryItems.map((item, idx) => (
                  <div
                    key={idx}
                    id={`slide-${idx}`}
                    className="carousel-item relative w-80 sm:w-96 h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md group"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <span className="badge badge-xs badge-success mb-2 font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h4 className="text-lg font-bold drop-shadow-sm">{item.title}</h4>
                      <p className="text-xs text-slate-300 mt-1">{item.location}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prev / Next Navigation Arrows */}
              <button
                onClick={scrollPrev}
                aria-label="Previous slide"
                className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white shadow-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all backdrop-blur-md border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next slide"
                className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white shadow-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all backdrop-blur-md border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Carousel Indicator Buttons & DaisyUI Kbd Tip */}
            <div className="flex flex-col sm:flex-row items-center justify-center w-full py-2 gap-3 sm:gap-6">
              <div className="flex gap-2">
                {galleryItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToIndex(i)}
                    className="w-7 h-7 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center shadow-sm"
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span>Navigate:</span>
                <kbd className="kbd kbd-xs">◀</kbd>
                <kbd className="kbd kbd-xs">▶</kbd>
              </div>
            </div>
          </div>
        )}

        {/* 3. DaisyUI Diff Component View */}
        {viewMode === "diff" && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Initiative selector tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {diffShowcases.map((showcase, index) => (
                <button
                  key={index}
                  onClick={() => setActiveDiffIndex(index)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    activeDiffIndex === index
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{showcase.title}</span>
                </button>
              ))}
            </div>

            {/* Diff Header */}
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentDiff.title} ({currentDiff.location})
              </h3>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {currentDiff.stats}
              </p>
            </div>

            {/* DaisyUI Browser Mockup Component: Wrapping Field Impact Diff Showcase */}
            <div className="mockup-browser border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 w-full shadow-2xl rounded-3xl overflow-hidden">
              <div className="mockup-browser-toolbar">
                <div className="input">https://caresphere.community/reports/{currentDiff.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}</div>
              </div>

              {/* DaisyUI Diff Component */}
              <figure
                className="diff aspect-16/9 relative cursor-ew-resize overflow-hidden border-t border-slate-100 dark:border-slate-800"
                tabIndex={0}
                style={{ "--diff-position": `${diffPos}%` } as React.CSSProperties}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                {/* After Item (diff-item-1) */}
                <div className="diff-item-1" role="img" tabIndex={0}>
                  <img alt={currentDiff.afterLabel} src={currentDiff.afterImage} />
                </div>

                {/* Before Item (diff-item-2) */}
                <div className="diff-item-2" role="img">
                  <img alt={currentDiff.beforeLabel} src={currentDiff.beforeImage} />
                </div>

                {/* Divider and Dragger (diff-resizer) */}
                <div className="diff-resizer"></div>

                {/* Floating Status Badges */}
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                  <span className="badge badge-success font-bold text-xs shadow-md">
                    {currentDiff.afterLabel}
                  </span>
                </div>
                <div className="absolute top-4 right-4 z-20 pointer-events-none">
                  <span className="badge badge-neutral font-bold text-xs shadow-md">
                    {currentDiff.beforeLabel}
                  </span>
                </div>
              </figure>
            </div>

            {/* Interactive Range Slider Control */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Move slider or hover over image to compare:
              </span>
              <div className="flex items-center gap-3 w-full sm:w-72">
                <span className="text-[11px] font-bold text-slate-400">Before</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={diffPos}
                  onChange={(e) => setDiffPos(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                  aria-label="Comparison slider"
                />
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">After</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
