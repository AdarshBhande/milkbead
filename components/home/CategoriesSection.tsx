"use client";

import Link from "next/link";
import { CATEGORIES } from "@/types";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const categoryData: Record<string, { emoji: string; gradient: string; count: string; accent: string }> = {
  Necklaces: { emoji: "✨", gradient: "from-pink-100 to-rose-50", count: "24 pieces", accent: "#F8C8DC" },
  Bracelets: { emoji: "💫", gradient: "from-purple-100 to-lavender", count: "31 pieces", accent: "#C8B0F0" },
  Earrings: { emoji: "🌸", gradient: "from-amber-50 to-yellow-100", count: "18 pieces", accent: "#FDE68A" },
  Keychains: { emoji: "🔑", gradient: "from-blue-100 to-cyan-50", count: "15 pieces", accent: "#BAE6FD" },
  Bows: { emoji: "🎀", gradient: "from-pink-200 to-fuchsia-100", count: "12 pieces", accent: "#F0ABFC" },
  Rings: { emoji: "💍", gradient: "from-amber-100 to-orange-50", count: "9 pieces", accent: "#FCD34D" },
  "Phone Charms": { emoji: "📱", gradient: "from-teal-100 to-emerald-50", count: "20 pieces", accent: "#6EE7B7" },
};

export default function CategoriesSection() {
  useScrollReveal();

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="section-wrapper">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <p className="text-milkpink font-nunito font-700 text-sm tracking-widest uppercase mb-2">
            Browse By
          </p>
          <h2 className="font-nunito font-800 text-3xl md:text-4xl text-softblack">
            Shop Categories
          </h2>
          <p className="font-inter text-gray-400 text-sm mt-2">
            Handcrafted with love for every aesthetic ✿
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, idx) => {
            const data = categoryData[cat];
            return (
              <Link
                key={cat}
                href={`/shop?category=${encodeURIComponent(cat)}`}
                id={`category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className={`reveal group relative overflow-hidden rounded-3xl bg-gradient-to-br ${data.gradient} p-6 flex flex-col items-center justify-center gap-3 hover:-translate-y-3 hover:shadow-soft-lg transition-all duration-300 cursor-pointer border border-white/50 min-h-[150px]`}
                style={{ animationDelay: `${idx * 0.07}s`, transitionDelay: `${idx * 0.04}s` }}
              >
                {/* Animated background circle */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full group-hover:scale-[2.5] transition-transform duration-700 ease-out" />

                {/* Glow ring on hover */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: `inset 0 0 0 2px ${data.accent}60` }} />

                {/* Emoji */}
                <span className="text-4xl group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300 relative z-10 drop-shadow-md">
                  {data.emoji}
                </span>

                <div className="text-center relative z-10">
                  <h3 className="font-nunito font-700 text-softblack text-sm md:text-base leading-tight">
                    {cat}
                  </h3>
                  <p className="font-inter text-xs text-gray-400 mt-0.5">{data.count}</p>
                </div>

                {/* Hover arrow */}
                <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300 shadow-sm">
                  <span className="text-sm text-softblack font-bold">→</span>
                </div>
              </Link>
            );
          })}

          {/* View All Card */}
          <Link
            href="/shop"
            className="reveal group relative overflow-hidden rounded-3xl bg-gradient-to-br from-beige to-beige-dark p-6 flex flex-col items-center justify-center gap-3 hover:-translate-y-3 hover:shadow-soft-lg transition-all duration-300 cursor-pointer border border-white/50 min-h-[150px]"
            style={{ transitionDelay: `${CATEGORIES.length * 0.04}s` }}
          >
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full group-hover:scale-[2.5] transition-transform duration-700 ease-out" />
            <span className="text-4xl group-hover:rotate-[360deg] transition-transform duration-700 relative z-10">
              🛍️
            </span>
            <div className="text-center relative z-10">
              <h3 className="font-nunito font-700 text-softblack text-sm md:text-base">View All</h3>
              <p className="font-inter text-xs text-gray-400 mt-0.5">All products</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
