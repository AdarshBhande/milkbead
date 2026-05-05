"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { mockProducts } from "@/lib/mockData";

// ─── Pick 5 bestsellers for the carousel ───────────────────────
const BESTSELLERS = mockProducts.filter((p) => p.badge === "BESTSELLER").slice(0, 5);

// Category → gradient for slide background
const SLIDE_GRADIENTS: Record<string, string> = {
  Necklaces: "135deg, #FDE8F2 0%, #F8C8DC 50%, #EFD9FF 100%",
  Bracelets: "135deg, #EFD9FF 0%, #C8B0F0 50%, #F8C8DC 100%",
  Earrings:  "135deg, #FFF9E6 0%, #FDE8F2 50%, #F8C8DC 100%",
  Keychains: "135deg, #E0F7FA 0%, #FDE8F2 50%, #EFD9FF 100%",
  Bows:      "135deg, #F8C8DC 0%, #FDE8F2 50%, #EFD9FF 100%",
  Rings:     "135deg, #FFF3E0 0%, #FDE8F2 50%, #F8C8DC 100%",
  "Phone Charms": "135deg, #E0F2F1 0%, #EFD9FF 50%, #FDE8F2 100%",
};

const CATEGORY_EMOJI: Record<string, string> = {
  Necklaces: "✨", Bracelets: "💫", Earrings: "🌸",
  Keychains: "🔑", Bows: "🎀", Rings: "💍", "Phone Charms": "📱",
};

// Floating decorative emojis per slide
const SLIDE_FLOATERS = ["🌸", "✨", "🎀", "💎", "🌙", "⭐", "💫", "🌷"];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const goTo = useCallback(
    (idx: number, dir: "next" | "prev" = "next") => {
      if (isAnimating) return;
      setIsAnimating(true);
      setDirection(dir);
      setCurrent(idx);
      setTimeout(() => setIsAnimating(false), 700);
    },
    [isAnimating]
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % BESTSELLERS.length, "next");
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + BESTSELLERS.length) % BESTSELLERS.length, "prev");
  }, [current, goTo]);

  // Auto-advance every 3 seconds
  useEffect(() => {
    const t = setInterval(goNext, 3000);
    return () => clearInterval(t);
  }, [goNext]);

  const slide = BESTSELLERS[current];
  const gradient = SLIDE_GRADIENTS[slide.category] || "135deg, #FDE8F2 0%, #F8C8DC 100%";
  const emoji = CATEGORY_EMOJI[slide.category] || "✨";

  return (
    <section
      className="relative overflow-hidden min-h-[90vh] flex items-center"
      style={{
        background: `linear-gradient(${gradient})`,
        backgroundSize: "300% 300%",
        transition: "background 0.8s ease",
      }}
    >
      {/* ── Animated gradient overlay (subtle) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(${gradient})`,
          backgroundSize: "400% 400%",
          animation: "gradientShift 10s ease infinite",
          opacity: 0.4,
        }}
      />

      {/* ── Background blobs ── */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #E6D6FF 0%, transparent 70%)", animation: "float 8s ease-in-out infinite" }} />
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, #F8C8DC 0%, transparent 70%)", animation: "float 6s ease-in-out infinite", animationDelay: "1s" }} />
      <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #F5E6D3 0%, transparent 70%)", animation: "pulseSoft 5s ease-in-out infinite" }} />

      {/* ── Floating emoji particles ── */}
      {SLIDE_FLOATERS.map((e, i) => (
        <div
          key={i}
          className="absolute hidden md:block pointer-events-none select-none"
          style={{
            fontSize: i % 2 === 0 ? "2.2rem" : "1.6rem",
            top: `${8 + i * 11}%`,
            left: i < 4 ? `${3 + i * 3}%` : undefined,
            right: i >= 4 ? `${3 + (i - 4) * 3}%` : undefined,
            animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.35}s`,
            filter: "drop-shadow(0 2px 8px rgba(248,200,220,0.5))",
            opacity: 0.85,
          }}
        >
          {e}
        </div>
      ))}

      {/* ── Main Slide Content ── */}
      <div className="section-wrapper relative z-10 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* LEFT — text content */}
          <div
            key={`text-${current}`}
            style={{
              animation: direction === "next"
                ? "slideInFromRight 0.6s cubic-bezier(0.22,1,0.36,1) both"
                : "slideInFromLeft 0.6s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mb-5 shadow-soft">
              <span style={{ animation: "twinkle 2s ease-in-out infinite" }}>⭐</span>
              <span className="font-nunito font-700 text-sm text-softblack">
                BESTSELLER #{current + 1} of {BESTSELLERS.length}
              </span>
            </div>

            {/* Category */}
            <p className="font-nunito font-700 text-pink-dark text-sm uppercase tracking-widest mb-2">
              {slide.category}
            </p>

            {/* Product Name */}
            <h1 className="font-nunito font-900 text-softblack leading-tight mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}>
              {slide.name}
            </h1>

            {/* Description */}
            <p className="font-inter text-gray-500 text-base leading-relaxed mb-5 max-w-md line-clamp-2">
              {slide.description}
            </p>

            {/* Rating row */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15}
                    className={i < Math.floor(slide.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}
                    style={i < Math.floor(slide.rating) ? { animation: `twinkle ${2 + i * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.15}s` } : {}}
                  />
                ))}
              </div>
              <span className="font-nunito font-700 text-softblack text-sm">{slide.rating}</span>
              <span className="font-inter text-xs text-gray-400">({slide.reviewCount} reviews)</span>
            </div>

            {/* Price + CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="font-nunito font-900 text-4xl text-softblack">₹{slide.price}</span>
                {slide.originalPrice && (
                  <span className="font-inter text-lg text-gray-300 line-through ml-2">₹{slide.originalPrice}</span>
                )}
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/product/${slide.id}`}
                  className="btn-primary px-6 py-3 text-base rounded-2xl animate-ripple"
                  style={{ boxShadow: "0 0 0 0 rgba(248,200,220,0.6)" }}
                >
                  View Product <ArrowRight size={17} />
                </Link>
                <Link
                  href="/shop"
                  className="btn-secondary px-6 py-3 text-base rounded-2xl"
                >
                  <ShoppingBag size={17} /> Shop All
                </Link>
              </div>
            </div>

            {/* Slide indicators */}
            <div className="flex items-center gap-2 mt-8">
              {BESTSELLERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? "next" : "prev")}
                  className="transition-all duration-400 rounded-full"
                  style={{
                    width: i === current ? "32px" : "10px",
                    height: "10px",
                    backgroundColor: i === current ? "#F0A0C0" : "#F8C8DC",
                    opacity: i === current ? 1 : 0.5,
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT — product image */}
          <div
            key={`image-${current}`}
            className="flex items-center justify-center"
            style={{
              animation: direction === "next"
                ? "slideInFromLeft 0.6s cubic-bezier(0.22,1,0.36,1) both"
                : "slideInFromRight 0.6s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            <div className="relative w-full max-w-sm aspect-square">
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-[40px]"
                style={{
                  background: `linear-gradient(${gradient})`,
                  filter: "blur(30px)",
                  opacity: 0.5,
                  animation: "glowPulse 2.5s ease-in-out infinite",
                  transform: "scale(1.05)",
                }}
              />

              {/* Card */}
              <div
                className="relative w-full h-full rounded-[40px] overflow-hidden shadow-soft-lg flex items-center justify-center"
                style={{ background: `linear-gradient(${gradient})` }}
              >
                {slide.images?.[0] ? (
                  <img
                    src={slide.images[0]}
                    alt={slide.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      const fb = (e.target as HTMLImageElement).nextElementSibling as HTMLElement | null;
                      if (fb) fb.style.display = "flex";
                    }}
                  />
                ) : null}

                {/* Emoji fallback */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                  style={{ display: slide.images?.[0] ? "none" : "flex" }}
                >
                  <span className="text-[7rem] drop-shadow-lg" style={{ animation: "float 3s ease-in-out infinite" }}>
                    {emoji}
                  </span>
                  <p className="font-nunito font-700 text-gray-400 text-lg">{slide.category}</p>
                </div>

                {/* Badge */}
                {slide.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="badge-bestseller text-sm font-nunito font-800 px-3 py-1.5 rounded-full shadow-sm" style={{ animation: "pulseSoft 2s ease-in-out infinite" }}>
                      ⭐ {slide.badge}
                    </span>
                  </div>
                )}

                {/* Price tag floating */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-soft">
                  <p className="font-nunito font-900 text-softblack text-lg">₹{slide.price}</p>
                  {slide.originalPrice && (
                    <p className="font-inter text-xs text-gray-400 line-through">₹{slide.originalPrice}</p>
                  )}
                </div>
              </div>

              {/* Sparkle dots around the card */}
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-milkpink/70"
                  style={{
                    top: i < 2 ? `${10 + i * 80}%` : "50%",
                    left: i === 0 ? "-8px" : i === 2 ? "-8px" : undefined,
                    right: i === 1 ? "-8px" : i === 3 ? "-8px" : undefined,
                    animation: `twinkle ${2 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom wave ── */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 70L1440 70L1440 25C1200 65 900 5 720 25C540 45 240 5 0 25L0 70Z" fill="white" />
        </svg>
      </div>

      {/* ── Slide counter top-right ── */}
      <div className="absolute top-6 right-6 z-20 hidden md:flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-soft">
        <span className="font-nunito font-800 text-softblack text-sm">{current + 1}</span>
        <span className="text-gray-300 text-sm">/</span>
        <span className="font-nunito text-gray-400 text-sm">{BESTSELLERS.length}</span>
      </div>

      {/* Custom keyframe for slide directions */}
      <style>{`
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
