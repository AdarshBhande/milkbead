import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { trendingProducts } from "@/lib/mockData";

export default function TrendingSection() {
  const displayed = trendingProducts.slice(0, 4);

  return (
    <section className="py-16 bg-white">
      <div className="section-wrapper">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-lavender-dark font-nunito font-700 text-sm tracking-widest uppercase mb-2 flex items-center gap-1">
              <TrendingUp size={14} /> Trending Now
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
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-12 bg-gradient-to-r from-pink-light via-beige to-lavender/30 rounded-3xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "2,000+", label: "Happy Customers", emoji: "💖" },
            { value: "100%", label: "Handmade", emoji: "✋" },
            { value: "4.9★", label: "Average Rating", emoji: "⭐" },
            { value: "7+", label: "Categories", emoji: "🎀" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="font-nunito font-800 text-softblack text-xl">{stat.value}</div>
              <div className="font-inter text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
