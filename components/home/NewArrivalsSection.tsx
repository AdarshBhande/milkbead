import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { newArrivals } from "@/lib/mockData";

export default function NewArrivalsSection() {
  const displayed = newArrivals.slice(0, 4);

  return (
    <section className="py-16 bg-pink-light/30">
      <div className="section-wrapper">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-milkpink font-nunito font-700 text-sm tracking-widest uppercase mb-2">
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
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="text-center mt-8 sm:hidden">
          <Link href="/shop?badge=NEW" className="btn-primary">
            View All New Arrivals
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
