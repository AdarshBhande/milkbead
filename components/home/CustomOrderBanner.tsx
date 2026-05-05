"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function CustomOrderBanner() {
  useScrollReveal();

  return (
    <section className="py-16 bg-beige/40 overflow-hidden">
      <div className="section-wrapper">
        <div className="reveal-zoom relative overflow-hidden rounded-[36px] p-10 md:p-16 text-center" style={{ background: "linear-gradient(135deg, #F8C8DC 0%, #FDE8F2 40%, #E6D6FF 100%)", backgroundSize: "300% 300%", animation: "gradientShift 6s ease infinite" }}>

          {/* Decorative blobs */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-white/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-lavender/30 rounded-full blur-3xl" />

          {/* Floating emoji particles */}
          {[
            { emoji: "🎀", top: "12%", left: "5%", delay: "0s" },
            { emoji: "✨", top: "15%", right: "6%", delay: "1s" },
            { emoji: "💖", bottom: "15%", left: "8%", delay: "0.5s" },
            { emoji: "🌸", bottom: "18%", right: "5%", delay: "1.5s" },
            { emoji: "🎵", top: "50%", left: "2%", delay: "0.8s" },
            { emoji: "💝", top: "55%", right: "2%", delay: "1.2s" },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute hidden md:block text-3xl pointer-events-none"
              style={{
                top: (p as any).top,
                bottom: (p as any).bottom,
                left: (p as any).left,
                right: (p as any).right,
                animation: `float 3.5s ease-in-out infinite`,
                animationDelay: p.delay,
                filter: "drop-shadow(0 2px 8px rgba(248,200,220,0.4))",
              }}
            >
              {p.emoji}
            </div>
          ))}

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-5 py-2 mb-6 shadow-soft animate-fade-up">
              <Sparkles size={14} className="text-pink-dark" style={{ animation: "twinkle 2s ease-in-out infinite" }} />
              <span className="font-nunito font-semibold text-sm text-softblack">Made just for you ✿</span>
            </div>

            <h2 className="font-nunito font-900 text-3xl md:text-5xl text-softblack mb-4 leading-tight animate-fade-up delay-100">
              Want something made{" "}
              <span className="relative inline-block">
                <span className="relative z-10">just for you?</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-white/70 -z-0 rounded-full" style={{ animation: "pulseSoft 2s ease-in-out infinite" }} />
              </span>
            </h2>

            <p className="font-inter text-gray-600 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed animate-fade-up delay-200">
              We lovingly craft custom beaded jewelry for you — your colors, your charms, your vibe.
              Perfect for gifts, birthdays, or treating yourself 🌸
            </p>

            <div className="flex flex-wrap gap-4 justify-center animate-fade-up delay-300">
              <Link
                href="/contact"
                id="custom-order-cta-btn"
                className="bg-white text-softblack font-nunito font-700 px-8 py-4 rounded-2xl hover:scale-105 hover:shadow-soft-glow transition-all duration-300 inline-flex items-center gap-2 shadow-soft animate-ripple"
                style={{ boxShadow: "0 0 0 0 rgba(248,200,220,0.6)" }}
              >
                Request Custom Order
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/shop"
                className="bg-softblack/10 backdrop-blur-sm text-softblack font-nunito font-600 px-8 py-4 rounded-2xl hover:scale-105 hover:bg-white/40 transition-all duration-300 inline-flex items-center gap-2"
              >
                Browse Existing Designs
              </Link>
            </div>

            {/* Feature chips */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {[
                { icon: "🎨", label: "Choose your colors" },
                { icon: "📏", label: "Custom sizing" },
                { icon: "🚚", label: "Pan India delivery" },
                { icon: "💌", label: "Gift wrapping" },
              ].map((f, i) => (
                <div
                  key={f.label}
                  className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/80 hover:scale-105 transition-all duration-200 cursor-default"
                  style={{ animation: "fadeUp 0.5s ease-out both", animationDelay: `${0.4 + i * 0.1}s` }}
                >
                  <span className="text-lg">{f.icon}</span>
                  <span className="font-nunito font-semibold text-sm text-softblack">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
