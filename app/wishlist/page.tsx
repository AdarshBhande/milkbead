"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/shop/ProductCard";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-4">
        <span className="text-8xl animate-bounce-soft">💖</span>
        <div className="text-center">
          <h1 className="font-nunito font-900 text-3xl text-softblack mb-2">Your wishlist is empty</h1>
          <p className="font-inter text-gray-400 text-sm mb-8">Save things you love by clicking the ♡ on any product</p>
          <Link href="/shop" className="btn-primary text-base px-8 py-4">
            Start Exploring
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-pink-light via-beige to-lavender/30 py-10">
        <div className="section-wrapper">
          <p className="text-milkpink font-nunito font-700 text-sm tracking-widest uppercase mb-2">Saved Items</p>
          <h1 className="font-nunito font-900 text-3xl md:text-4xl text-softblack mb-1 flex items-center gap-3">
            My Wishlist <Heart size={28} className="text-milkpink fill-milkpink" />
          </h1>
          <p className="font-inter text-sm text-gray-400">{wishlistCount} item{wishlistCount !== 1 ? "s" : ""} saved</p>
        </div>
      </div>

      <div className="section-wrapper py-8">
        {/* Add all to cart */}
        <div className="flex justify-end mb-6">
          <button
            id="wishlist-add-all-btn"
            onClick={() => wishlistItems.forEach((p) => addToCart(p))}
            className="btn-primary"
          >
            <ShoppingBag size={18} />
            Add All to Cart
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
