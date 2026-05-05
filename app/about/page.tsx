"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function AboutPage() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-white page-transition">
      {/* Hero */}
      <div className="relative overflow-hidden py-24" style={{ background: "linear-gradient(135deg, #FDE8F2 0%, #F8C8DC 35%, #EFD9FF 70%, #F5E6D3 100%)", backgroundSize: "400% 400%", animation: "gradientShift 8s ease infinite" }}>
        {/* Background blobs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-40" style={{ background: "radial-gradient(circle, #E6D6FF, transparent 70%)", animation: "float 8s ease-in-out infinite" }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #F8C8DC, transparent 70%)", animation: "float 6s ease-in-out infinite", animationDelay: "1s" }} />

        {/* Floating particles */}
        {["🌸", "✨", "🎀", "💖", "🌷"].map((e, i) => (
          <div
            key={i}
            className="absolute hidden md:block text-3xl pointer-events-none"
            style={{
              top: `${15 + i * 18}%`,
              left: i % 2 === 0 ? `${3 + i * 2}%` : undefined,
              right: i % 2 !== 0 ? `${3 + i * 2}%` : undefined,
              animation: `float ${3 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              filter: "drop-shadow(0 2px 8px rgba(248,200,220,0.4))",
            }}
          >
            {e}
          </div>
        ))}

        <div className="section-wrapper text-center relative z-10">
          <div className="text-7xl mb-4 inline-block" style={{ animation: "float 3s ease-in-out infinite" }}>🌸</div>
          <p className="text-milkpink font-nunito font-700 text-sm tracking-widest uppercase mb-3 animate-fade-up">Our Story</p>
          <h1 className="font-nunito font-900 text-4xl md:text-5xl text-softblack mb-4 leading-tight animate-fade-up delay-100">
            Made with Love,<br />One Bead at a Time
          </h1>
          <p className="font-inter text-gray-400 text-base max-w-md mx-auto animate-fade-up delay-200">
            We believe accessories should feel like a warm hug — soft, personal, and uniquely yours.
          </p>
        </div>
      </div>

      <div className="section-wrapper py-16">
        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="reveal-left">
            <div className="aspect-square rounded-[40px] bg-gradient-to-br from-pink-100 via-beige to-lavender/40 flex flex-col items-center justify-center relative overflow-hidden group hover-lift">
              {/* Decorative rings */}
              <div className="absolute inset-4 rounded-[32px] border-2 border-white/40 animate-ripple" />
              <span className="text-9xl relative z-10 group-hover:scale-110 transition-transform duration-500" style={{ animation: "float 3s ease-in-out infinite" }}>🎀</span>
              <p className="font-nunito font-700 text-gray-400 mt-4 relative z-10 group-hover:text-pink-dark transition-colors duration-300">milkbead ✿</p>
              {/* Sparkle dots */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-milkpink/60"
                  style={{
                    top: `${20 + i * 12}%`,
                    left: i % 2 === 0 ? `${8 + i * 3}%` : undefined,
                    right: i % 2 !== 0 ? `${8 + i * 3}%` : undefined,
                    animation: `twinkle ${2 + i * 0.4}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="reveal-right">
            <h2 className="font-nunito font-900 text-3xl text-softblack mb-4">Hello, I&apos;m Milkbead</h2>
            <div className="space-y-4 font-inter text-gray-500 text-sm leading-relaxed">
              <p>
                Milkbead started as a tiny passion project — stringing beads at my desk while watching anime, gifting handmade bracelets to friends, and realizing that there was magic in creating something with your hands.
              </p>
              <p>
                What started as a hobby grew into something bigger. Every piece is still made by hand, with carefully chosen beads, charms, and a whole lot of love. No machines, no shortcuts — just scissors, thread, and passion.
              </p>
              <p>
                Our pieces are designed for the soft girl, the kawaii lover, the aesthetic girlies, and anyone who believes that accessories don&apos;t have to be serious. They can be cozy, cute, and full of personality.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-10 reveal">
            <h2 className="font-nunito font-800 text-3xl text-softblack">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { emoji: "✋", title: "100% Handmade", desc: "Every piece is crafted by hand. No factories, no mass production." },
              { emoji: "💖", title: "Made with Love", desc: "We pour care into every bead, charm, and knot." },
              { emoji: "🌱", title: "Small Business", desc: "Supporting Milkbead means supporting a real person with a dream." },
              { emoji: "🎀", title: "Custom Orders", desc: "Can't find what you want? We'll make it just for you." },
            ].map((v, i) => (
              <div
                key={v.title}
                className="reveal card p-6 text-center hover:-translate-y-2 hover:shadow-soft-lg transition-all duration-300 group"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <span
                  className="text-4xl block mb-3 group-hover:scale-125 transition-transform duration-300"
                  style={{ animation: `bounceSoft ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}
                >
                  {v.emoji}
                </span>
                <h3 className="font-nunito font-700 text-softblack mb-2 group-hover:text-pink-dark transition-colors duration-300">{v.title}</h3>
                <p className="font-inter text-xs text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal-zoom text-center rounded-[32px] p-12 relative overflow-hidden" style={{ background: "linear-gradient(270deg, #FDE8F2, #F5E6D3, #E6D6FF, #FDE8F2)", backgroundSize: "300% 300%", animation: "gradientShift 6s ease infinite" }}>
          <span className="text-5xl block mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>💌</span>
          <h2 className="font-nunito font-900 text-2xl md:text-3xl text-softblack mb-3">
            Ready to find your new favourite accessory?
          </h2>
          <p className="font-inter text-gray-400 text-sm mb-6">
            From necklaces to phone charms — there&apos;s something for every aesthetic.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/shop" className="btn-primary px-8 py-4 text-base animate-ripple">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn-secondary px-8 py-4 text-base">
              Custom Order 🎀
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
