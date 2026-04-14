import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function CustomOrderBanner() {
  return (
    <section className="py-16 bg-beige/40">
      <div className="section-wrapper">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-milkpink via-pink-light to-lavender/60 p-10 md:p-16 text-center">
          {/* Decorative elements */}
          <div className="absolute top-4 left-8 text-4xl animate-float" style={{ animationDelay: "0s" }}>🎀</div>
          <div className="absolute top-6 right-10 text-3xl animate-float" style={{ animationDelay: "1s" }}>✨</div>
          <div className="absolute bottom-4 left-16 text-3xl animate-float" style={{ animationDelay: "0.5s" }}>💖</div>
          <div className="absolute bottom-6 right-8 text-3xl animate-float" style={{ animationDelay: "1.5s" }}>🌸</div>

          {/* Blob decorations */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-lavender/30 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
              <Sparkles size={14} className="text-pink-dark" />
              <span className="font-nunito font-semibold text-sm text-softblack">Made just for you</span>
            </div>

            <h2 className="font-nunito font-900 text-3xl md:text-5xl text-softblack mb-4 leading-tight">
              Want something made{" "}
              <span className="relative">
                <span className="relative z-10">just for you?</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-white/60 -z-0 rounded-full" />
              </span>
            </h2>

            <p className="font-inter text-gray-600 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              We lovingly craft custom beaded jewelry for you — your colors, your charms, your vibe.
              Perfect for gifts, birthdays, or treating yourself 🌸
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                id="custom-order-cta-btn"
                className="bg-white text-softblack font-nunito font-700 px-8 py-4 rounded-2xl hover:scale-105 hover:shadow-soft-glow transition-all duration-300 inline-flex items-center gap-2 shadow-soft"
              >
                Request Custom Order
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/shop"
                className="bg-softblack/10 backdrop-blur-sm text-softblack font-nunito font-600 px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                Browse Existing Designs
              </Link>
            </div>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {[
                { icon: "🎨", label: "Choose your colors" },
                { icon: "📏", label: "Custom sizing" },
                { icon: "🚚", label: "Pan India delivery" },
                { icon: "💌", label: "Gift wrapping" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 bg-white/40 rounded-full px-4 py-2">
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
