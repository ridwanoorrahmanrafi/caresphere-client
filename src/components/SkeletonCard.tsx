import React from "react";

export default function SkeletonCard() {
  return (
    <div className="card card-border rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col h-full">
      {/* Image Skeleton (DaisyUI Skeleton) */}
      <div className="skeleton w-full h-52 rounded-none" />

      {/* Content Skeleton (DaisyUI Skeleton primitives) */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Badge & Date */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="skeleton h-6 w-24 rounded-full" />
            <div className="skeleton h-4 w-28 rounded-md" />
          </div>

          {/* Title */}
          <div className="skeleton h-6 w-5/6 rounded-md mb-2" />
          <div className="skeleton h-4 w-4/6 rounded-md mb-4" />

          {/* Location */}
          <div className="flex items-center gap-2 mb-4">
            <div className="skeleton w-4 h-4 rounded-full shrink-0" />
            <div className="skeleton h-4 w-40 rounded-md" />
          </div>

          {/* Description Excerpt */}
          <div className="space-y-1.5">
            <div className="skeleton h-3.5 w-full rounded" />
            <div className="skeleton h-3.5 w-4/5 rounded" />
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="skeleton h-10 w-full rounded-xl mt-4" />
      </div>
    </div>
  );
}
