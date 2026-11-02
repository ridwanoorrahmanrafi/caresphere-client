import React from "react";
import { Users, Shirt, Trees, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

interface StatItem {
  icon: React.ElementType;
  value: string;
  label: string;
  subtext: string;
  badge?: string;
  badgeType?: string;
  iconBg: string;
  iconColor: string;
  progressValue: number;
  progressColor: string;
}

const statsData: StatItem[] = [
  {
    icon: Users,
    value: "14,800+",
    label: "Active Volunteers",
    subtext: "Across 18 districts in Bangladesh",
    badge: "↗ +18% this month",
    badgeType: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/50 dark:border-emerald-800/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    progressValue: 92,
    progressColor: "progress-primary",
  },
  {
    icon: Shirt,
    value: "22,500+",
    label: "Warm Garments",
    subtext: "Distributed in cold-wave zones",
    badge: "Seasonal Peak",
    badgeType: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60",
    iconBg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200/50 dark:border-amber-800/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    progressValue: 75,
    progressColor: "progress-warning",
  },
  {
    icon: Trees,
    value: "8,200+",
    label: "Saplings Planted",
    subtext: "Restoring urban biodiversity",
    badge: "Green Initiative",
    badgeType: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60",
    iconBg: "bg-teal-50 dark:bg-teal-950/60 border-teal-200/50 dark:border-teal-800/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    progressValue: 82,
    progressColor: "progress-secondary",
  },
  {
    icon: Sparkles,
    value: "99.4%",
    label: "Event Success Rate",
    subtext: "Grassroots audited milestones",
    badge: "Verified Impact",
    badgeType: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60",
    iconBg: "bg-sky-50 dark:bg-sky-950/60 border-sky-200/50 dark:border-sky-800/50",
    iconColor: "text-sky-600 dark:text-sky-400",
    progressValue: 99,
    progressColor: "progress-info",
  },
];

export default function ImpactStats() {
  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Real-time Community Metrics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Our Collective Impact Across Bangladesh
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>All metrics dynamically validated by verified organizers</span>
        </p>
      </div>

      {/* DaisyUI Stat Component */}
      <div className="stats stats-vertical lg:stats-horizontal shadow-xl w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
        {statsData.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat p-6 sm:p-7 hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors">
              <div className="stat-figure">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${s.iconBg} ${s.iconColor} shadow-sm`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="stat-title text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                {s.label}
              </div>
              <div className="stat-value text-slate-900 dark:text-white my-1">
                {s.value}
              </div>
              <div className="stat-desc flex flex-col gap-1.5 mt-0.5">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate">
                  {s.subtext}
                </span>
                {s.badge && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold w-max ${s.badgeType}`}
                  >
                    {s.badge}
                  </span>
                )}
                {/* DaisyUI Progress Component Primitives */}
                <div className="pt-2 mt-0.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span>Target Progress</span>
                    <span>{s.progressValue}%</span>
                  </div>
                  <progress
                    className={`progress ${s.progressColor} w-full h-1.5`}
                    value={s.progressValue}
                    max={100}
                  ></progress>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
