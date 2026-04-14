import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient min-h-[85vh] flex items-center">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-lavender/40 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-milkpink/40 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-beige/30 blur-3xl" />

      {/* Floating elements */}
      <div className="absolute top-20 left-10 text-4xl animate-float hidden md:block" style={{ animationDelay: "0s" }}>🌸</div>
      <div className="absolute top-32 right-20 text-3xl animate-float hidden md:block" style={{ animationDelay: "0.8s" }}>✨</div>
      <div className="absolute bottom-32 left-32 text-3xl animate-float hidden md:block" style={{ animationDelay: "1.6s" }}>🎀</div>
      <div className="absolute bottom-20 right-10 text-4xl animate-float hidden md:block" style={{ animationDelay: "0.4s" }}>💎</div>
      <div className="absolute top-1/2 left-8 text-2xl animate-float-slow hidden lg:block" style={{ animationDelay: "1.2s" }}>🌙</div>
      <div className="absolute top-16 left-1/2 text-2xl animate-float hidden lg:block" style={{ animationDelay: "2s" }}>⭐</div>

      <div className="section-wrapper relative z-10 py-20">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-soft animate-fade-in">
            <Sparkles size={14} className="text-pink-dark" />
            <span className="font-nunito font-semibold text-sm text-softblack">
              Handmade in India 🇮🇳
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-nunito font-900 text-softblack leading-tight mb-4 animate-fade-in" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
            Soft things you&apos;ll{" "}
            <span className="relative">
              <span className="relative z-10 text-pink-dark">never</span>
              <span className="absolute inset-x-0 bottom-1 h-3 bg-milkpink/50 -z-0 rounded-full" />
            </span>{" "}
            want to take off
          </h1>

          <p className="font-nunito font-400 text-gray-500 text-lg md:text-xl mb-8 leading-relaxed animate-fade-in">
            Like a cozy hug you can wear 🤍
            <br />
            <span className="text-base text-gray-400">Kawaii beads. Custom orders. Made just for you.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-fade-in">
            <Link
              href="/shop"
              id="hero-shop-now-btn"
              className="btn-primary text-base px-8 py-4 rounded-2xl shadow-soft-glow"
            >
              Shop Now
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              id="hero-custom-order-btn"
              className="btn-secondary text-base px-8 py-4 rounded-2xl"
            >
              Custom Order 🎀
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 mt-10 animate-fade-in">
            <div className="flex -space-x-2">
              {["P", "A", "R", "S"].map((initial, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-milkpink border-2 border-white flex items-center justify-center text-xs font-nunito font-bold text-softblack"
                >
                  {initial}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-xs font-inter text-gray-500">
                <strong className="text-softblack font-nunito">2,000+</strong> happy customers 💖
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 20C1200 60 900 0 720 20C540 40 240 0 0 20L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
