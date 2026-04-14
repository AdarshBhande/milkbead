import { Star } from "lucide-react";
import { mockTestimonials } from "@/lib/mockData";

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="section-wrapper">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-milkpink font-nunito font-700 text-sm tracking-widest uppercase mb-2">
            Customer Love 💌
          </p>
          <h2 className="font-nunito font-800 text-3xl md:text-4xl text-softblack">
            What People Are Saying
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mockTestimonials.map((t) => (
            <div
              key={t.id}
              className="card p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-soft-lg transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < t.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="font-inter text-sm text-gray-600 leading-relaxed flex-1">
                &ldquo;{t.comment}&rdquo;
              </p>

              {/* Tag */}
              <span className="inline-block text-xs font-nunito font-semibold bg-pink-light text-pink-dark px-2.5 py-1 rounded-full w-fit">
                {t.product}
              </span>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-pink-100">
                <div className="w-9 h-9 rounded-full bg-milkpink flex items-center justify-center font-nunito font-bold text-softblack">
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
        <div className="text-center mt-10">
          <p className="font-inter text-sm text-gray-400 mb-4">
            Share your Milkbead look and tag us!
          </p>
          <a
            href="https://instagram.com/milkbeads.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-milkpink to-lavender text-softblack font-nunito font-700 px-6 py-3 rounded-2xl hover:scale-105 hover:shadow-soft-glow transition-all duration-300"
          >
            <span>📸</span>
            @milkbeads.co on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
