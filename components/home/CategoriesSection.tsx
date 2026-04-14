import Link from "next/link";
import { CATEGORIES } from "@/types";

const categoryData: Record<string, { emoji: string; gradient: string; count: string }> = {
  Necklaces: { emoji: "✨", gradient: "from-pink-100 to-rose-50", count: "24 pieces" },
  Bracelets: { emoji: "💫", gradient: "from-purple-100 to-lavender", count: "31 pieces" },
  Earrings: { emoji: "🌸", gradient: "from-amber-50 to-yellow-100", count: "18 pieces" },
  Keychains: { emoji: "🔑", gradient: "from-blue-100 to-cyan-50", count: "15 pieces" },
  Bows: { emoji: "🎀", gradient: "from-pink-200 to-fuchsia-100", count: "12 pieces" },
  Rings: { emoji: "💍", gradient: "from-amber-100 to-orange-50", count: "9 pieces" },
  "Phone Charms": { emoji: "📱", gradient: "from-teal-100 to-emerald-50", count: "20 pieces" },
};

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="section-wrapper">
        {/* Header */}
        <div className="text-center mb-10">
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
          {CATEGORIES.map((cat) => {
            const data = categoryData[cat];
            return (
              <Link
                key={cat}
                href={`/shop?category=${encodeURIComponent(cat)}`}
                id={`category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${data.gradient} p-6 flex flex-col items-center justify-center gap-3 hover:-translate-y-2 hover:shadow-soft-lg transition-all duration-300 cursor-pointer border border-white/50 min-h-[140px]`}
              >
                {/* Decorative circle */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-500" />

                <span className="text-4xl group-hover:scale-110 transition-transform duration-300 relative z-10">
                  {data.emoji}
                </span>
                <div className="text-center relative z-10">
                  <h3 className="font-nunito font-700 text-softblack text-sm md:text-base leading-tight">
                    {cat}
                  </h3>
                  <p className="font-inter text-xs text-gray-400 mt-0.5">{data.count}</p>
                </div>

                {/* Hover arrow */}
                <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs text-softblack">→</span>
                </div>
              </Link>
            );
          })}

          {/* View All Card */}
          <Link
            href="/shop"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-beige to-beige-dark p-6 flex flex-col items-center justify-center gap-3 hover:-translate-y-2 hover:shadow-soft-lg transition-all duration-300 cursor-pointer border border-white/50 min-h-[140px]"
          >
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <span className="text-4xl group-hover:rotate-45 transition-transform duration-300 relative z-10">
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
