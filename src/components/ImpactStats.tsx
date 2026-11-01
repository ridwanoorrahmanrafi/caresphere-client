import React from "react";
import { Users, Shirt, Trees, Sparkles } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "14,800+",
    label: "Active Volunteers",
    subtext: "Across 18 districts in Bangladesh",
  },
  {
    icon: Shirt,
    value: "22,500+",
    label: "Warm Garments & Blankets",
    subtext: "Distributed in cold-wave zones",
  },
  {
    icon: Trees,
    value: "8,200+",
    label: "Saplings Planted",
    subtext: "Restoring urban biodiversity",
  },
  {
    icon: Sparkles,
    value: "99.4%",
    label: "Event Success Rate",
    subtext: "Reported by grassroots organizers",
  },
];

export default function ImpactStats() {
  return (
    <section className="py-16 bg-emerald-600 dark:bg-emerald-900/60 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black tracking-tight">{s.value}</p>
                  <p className="text-sm font-semibold text-emerald-100">{s.label}</p>
                  <p className="text-xs text-emerald-200/80">{s.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
