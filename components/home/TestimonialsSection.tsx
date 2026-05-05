"use client";

import { Star } from "lucide-react";
import { mockTestimonials } from "@/lib/mockData";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function TestimonialsSection() {
  useScrollReveal();

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="section-wrapper">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <p className="text-milkpink font-nunito font-700 text-sm tracking-widest uppercase mb-2">
            Customer Love 💌
          </p>
          <h2 className="font-nunito font-800 text-3xl md:text-4xl text-softblack">
            What People Are Saying
          </h2>
          <p className="font-inter text-gray-400 text-sm mt-2">Real reviews from real kawaii lovers ✨</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mockTestimonials.map((t, idx) => (
            <div
              key={t.id}
              className="reveal card p-6 flex flex-col gap-4 hover:-translate-y-2 hover:shadow-soft-lg transition-all duration-300 group"
              style={{ transitionDelay: `${idx * 0.05}s` }}
            >
              {/* Decorative top corner */}
              <div className="absolute -top-2 -right-2 text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-1"
                style={{ animation: "twinkle 2s ease-in-out infinite", animationDelay: `${idx * 0.3}s` }}>
                ✨
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < t.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                    style={i < t.rating ? { animation: `twinkle ${2 + i * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.15}s` } : {}}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="font-inter text-sm text-gray-600 leading-relaxed flex-1">
                &ldquo;{t.comment}&rdquo;
              </p>

              {/* Tag */}
              <span className="inline-block text-xs font-nunito font-semibold bg-pink-light text-pink-dark px-2.5 py-1 rounded-full w-fit group-hover:bg-milkpink transition-colors duration-300">
                {t.product}
              </span>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-pink-100">
                <div className="w-9 h-9 rounded-full bg-milkpink flex items-center justify-center font-nunito font-bold text-softblack group-hover:scale-110 transition-transform duration-300 group-hover:animate-ripple">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-nunito font-700 text-sm text-softblack">{t.name}</p>
                  <p className="font-inter text-xs text-gray-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="text-center mt-12 reveal">
          <p className="font-inter text-sm text-gray-400 mb-4">
            Share your Milkbead look and tag us!
          </p>
          <a
            href="https://instagram.com/milkbeads.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-nunito font-700 px-8 py-3 rounded-2xl hover:scale-105 hover:shadow-soft-glow transition-all duration-300 text-softblack"
            style={{ background: "linear-gradient(270deg, #F8C8DC, #E6D6FF, #F5E6D3, #F8C8DC)", backgroundSize: "300% 300%", animation: "gradientShift 4s ease infinite" }}
          >
            <span>📸</span>
            @milkbeads.co on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
