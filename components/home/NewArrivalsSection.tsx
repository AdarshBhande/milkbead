"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { newArrivals } from "@/lib/mockData";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function NewArrivalsSection() {
  useScrollReveal();
  const displayed = newArrivals.slice(0, 4);

  return (
    <section className="py-20 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FDE8F2 40%, #FFFFFF 100%)" }}>
      <div className="section-wrapper">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 reveal">
          <div>
            <p className="text-milkpink font-nunito font-700 text-sm tracking-widest uppercase mb-2 flex items-center gap-2">
              <Sparkles size={14} style={{ animation: "twinkle 1.5s ease-in-out infinite" }} />
              Just Dropped 🌟
            </p>
            <h2 className="font-nunito font-800 text-3xl md:text-4xl text-softblack">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?badge=NEW"
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

        {/* Mobile View All */}
        <div className="text-center mt-8 sm:hidden reveal">
          <Link href="/shop?badge=NEW" className="btn-primary">
            View All New Arrivals
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
