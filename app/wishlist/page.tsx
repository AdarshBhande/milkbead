"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/shop/ProductCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function WishlistPage() {
  useScrollReveal();
  const { wishlistItems, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-4 page-transition">
        <span className="text-8xl block animate-heartbeat" style={{ filter: "drop-shadow(0 4px 16px rgba(248,200,220,0.5))" }}>💖</span>
        <div className="text-center animate-fade-up">
          <h1 className="font-nunito font-900 text-3xl text-softblack mb-2">Your wishlist is empty</h1>
          <p className="font-inter text-gray-400 text-sm mb-8">Save things you love by clicking the ♡ on any product</p>
          <Link href="/shop" className="btn-primary text-base px-8 py-4 animate-ripple">
            Start Exploring
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white page-transition">
      {/* Header */}
      <div className="relative overflow-hidden py-12" style={{ background: "linear-gradient(135deg, #FDE8F2 0%, #F8C8DC 35%, #EFD9FF 70%, #F5E6D3 100%)", backgroundSize: "400% 400%", animation: "gradientShift 8s ease infinite" }}>
        {/* Blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-40" style={{ background: "radial-gradient(circle, #E6D6FF, transparent 70%)", animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #F8C8DC, transparent 70%)", animation: "float 8s ease-in-out infinite", animationDelay: "1s" }} />

        <div className="section-wrapper relative z-10">
          <p className="text-milkpink font-nunito font-700 text-sm tracking-widest uppercase mb-2 animate-fade-up">Saved Items</p>
          <h1 className="font-nunito font-900 text-3xl md:text-4xl text-softblack mb-1 flex items-center gap-3 animate-fade-up delay-100">
            My Wishlist
            <Heart
              size={28}
              className="text-milkpink fill-milkpink"
              style={{ animation: "heartbeat 1.5s ease-in-out infinite" }}
            />
          </h1>
          <p className="font-inter text-sm text-gray-400 animate-fade-up delay-200">
            {wishlistCount} item{wishlistCount !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      <div className="section-wrapper py-8">
        {/* Add all to cart */}
        <div className="flex justify-end mb-6 reveal">
          <button
            id="wishlist-add-all-btn"
            onClick={() => wishlistItems.forEach((p) => addToCart(p))}
            className="btn-primary hover:scale-105 transition-transform duration-300 animate-ripple"
          >
            <ShoppingBag size={18} />
            Add All to Cart
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {wishlistItems.map((product, i) => (
            <div
              key={product.id}
              className="reveal"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
