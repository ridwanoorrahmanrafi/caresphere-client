"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  className?: string;
  href?: string;
}

export default function Logo({
  size = "md",
  showSubtitle = true,
  className = "",
  href = "/",
}: LogoProps) {
  const iconSizeClasses = {
    sm: "w-8 h-8 rounded-xl",
    md: "w-11 h-11 rounded-2xl",
    lg: "w-14 h-14 rounded-3xl",
  }[size];

  const svgSize = {
    sm: 18,
    md: 24,
    lg: 32,
  }[size];

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  }[size];

  const content = (
    <div className={`flex items-center gap-3 group focus:outline-none ${className}`}>
      {/* Brand Icon Emblem */}
      <div
        className={`${iconSizeClasses} bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-indigo-500/35 transition-all duration-300 ring-1 ring-white/20 shrink-0`}
      >
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:rotate-6"
        >
          {/* Interlocking community nexus ribbons */}
          <path
            d="M16 4C9.37258 4 4 9.37258 4 16C4 20.1421 6.10457 23.7918 9.32456 25.9246C9.89745 26.3041 10.6698 26.1367 11.0493 25.5638C11.4288 24.9909 11.2614 24.2185 10.6885 23.839C8.01637 22.0691 6.28571 19.1008 6.28571 16C6.28571 10.635 10.635 6.28571 16 6.28571C21.365 6.28571 25.7143 10.635 25.7143 16C25.7143 18.5714 24.7143 20.8571 23.0847 22.5694C22.5653 23.1152 22.6041 23.9782 23.1499 24.4977C23.6957 25.0171 24.5587 24.9782 25.0782 24.4325C27.0378 22.3732 28.2857 19.4673 28.2857 16C28.2857 9.37258 22.9131 4 16 4Z"
            fill="white"
            fillOpacity="0.9"
          />
          {/* Inner heart/empathy arch */}
          <path
            d="M16 11.5C14.067 11.5 12.5 13.067 12.5 15C12.5 17.5 16 21 16 21C16 21 19.5 17.5 19.5 15C19.5 13.067 17.933 11.5 16 11.5Z"
            fill="white"
          />
          {/* Golden Sunset Spark (Humanity / Impact Beacon) */}
          <circle cx="21.5" cy="10.5" r="2.5" fill="#f59e0b" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col">
        <span
          className={`${textSizeClasses} font-black tracking-tight text-slate-900 dark:text-white flex items-center leading-tight`}
        >
          Care
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
            Sphere
          </span>
        </span>
        {showSubtitle && (
          <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600/90 dark:text-indigo-400/90 -mt-0.5 hidden sm:block">
            Community Impact Platform
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl py-0.5 px-0.5 inline-block"
      >
        {content}
      </Link>
    );
  }

  return content;
}

