import React from "react";

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 skeleton-shimmer bg-slate-200 dark:bg-slate-800" />

      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Badge & Date */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="h-6 w-24 rounded-full skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-28 rounded skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Title */}
          <div className="h-6 w-5/6 rounded mb-2 skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-4/6 rounded mb-4 skeleton-shimmer bg-slate-200 dark:bg-slate-800" />

          {/* Location */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-40 rounded skeleton-shimmer bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="h-10 w-full rounded-xl skeleton-shimmer bg-slate-200 dark:bg-slate-800 mt-4" />
      </div>
    </div>
  );
}
