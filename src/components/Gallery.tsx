import React from "react";
import { Camera } from "lucide-react";

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

export default function Gallery() {
  return (
    <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
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

        {/* Uniform Grid Layout with equal image sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800 h-64 bg-slate-200 dark:bg-slate-800"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white uppercase tracking-wider mb-1.5 backdrop-blur-sm">
                  {item.category}
                </span>
                <h4 className="text-base font-bold drop-shadow-sm line-clamp-1">{item.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
