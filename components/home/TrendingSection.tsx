"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { trendingProducts } from "@/lib/mockData";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function TrendingSection() {
  useScrollReveal();
  const displayed = trendingProducts.slice(0, 4);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="section-wrapper">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 reveal">
          <div>
            <p className="text-lavender-dark font-nunito font-700 text-sm tracking-widest uppercase mb-2 flex items-center gap-1">
              <TrendingUp size={14} style={{ animation: "bounceSoft 2s ease-in-out infinite" }} /> Trending Now
            </p>
            <h2 className="font-nunito font-800 text-3xl md:text-4xl text-softblack">
              Customer Faves
            </h2>
          </div>
          <Link
            href="/shop?badge=BESTSELLER"
            className="hidden sm:flex items-center gap-2 font-nunito font-semibold text-sm text-pink-dark hover:text-softblack transition-colors duration-200 group"
          >
            View All
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayed.map((product, i) => (
            <div
              key={product.id}
              className="reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Animated stats bar */}
        <div className="mt-14 rounded-3xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4 reveal" style={{ background: "linear-gradient(270deg, #FDE8F2, #F5E6D3, #E6D6FF, #FDE8F2)", backgroundSize: "300% 300%", animation: "gradientShift 7s ease infinite" }}>
          {[
            { value: "2,000+", label: "Happy Customers", emoji: "💖" },
            { value: "100%", label: "Handmade", emoji: "✋" },
            { value: "4.9★", label: "Average Rating", emoji: "⭐" },
            { value: "7+", label: "Categories", emoji: "🎀" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="text-center group cursor-default"
              style={{ animation: "fadeUp 0.5s ease-out both", animationDelay: `${i * 0.12}s` }}
            >
              <div
                className="text-2xl mb-1 group-hover:scale-125 transition-transform duration-300 inline-block"
                style={{ animation: "bounceSoft 2s ease-in-out infinite", animationDelay: `${i * 0.3}s` }}
              >
                {stat.emoji}
              </div>
              <div className="font-nunito font-800 text-softblack text-xl group-hover:text-pink-dark transition-colors duration-300">
                {stat.value}
              </div>
              <div className="font-inter text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
