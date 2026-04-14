"use client";

import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
  size?: "sm" | "md" | "lg";
}

export default function ProductCard({ product, size = "md" }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  const badgeColors = {
    NEW: "badge-new",
    BESTSELLER: "badge-bestseller",
    SALE: "bg-rose-100 text-rose-600 text-xs font-nunito font-700 px-2.5 py-1 rounded-full",
  };

  // Gradient placeholder colors per category
  const categoryGradients: Record<string, string> = {
    Necklaces: "from-pink-100 via-rose-50 to-pink-50",
    Bracelets: "from-purple-100 via-lavender to-purple-50",
    Earrings: "from-yellow-50 via-amber-50 to-yellow-100",
    Keychains: "from-blue-50 via-cyan-50 to-blue-100",
    Bows: "from-pink-100 via-fuchsia-50 to-rose-50",
    Rings: "from-amber-50 via-yellow-50 to-orange-50",
    "Phone Charms": "from-teal-50 via-emerald-50 to-teal-100",
  };

  const categoryEmojis: Record<string, string> = {
    Necklaces: "✨", Bracelets: "💫", Earrings: "🌸",
    Keychains: "🔑", Bows: "🎀", Rings: "💍", "Phone Charms": "📱",
  };

  const gradient = categoryGradients[product.category] || "from-pink-50 to-beige";
  const emoji = categoryEmojis[product.category] || "✨";

  return (
    <div className="product-card relative flex flex-col">
      {/* Image Container */}
      <Link href={`/product/${product.id}`} className="relative overflow-hidden aspect-square block">
        <div
          className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center`}
        >
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-4">
              <span className="text-5xl animate-float">{emoji}</span>
              <p className="text-xs font-nunito font-semibold text-gray-400 text-center">
                {product.category}
              </p>
            </div>
          )}
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className={badgeColors[product.badge]}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.preventDefault(); router.push(`/product/${product.id}`); }}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-soft hover:scale-110 transition-transform duration-200 -translate-y-2 group-hover:translate-y-0"
            aria-label="View product"
          >
            <Eye size={16} className="text-softblack" />
          </button>
        </div>

        {/* Wishlist button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-soft transition-all duration-200 hover:scale-110 ${
            inWishlist ? "bg-milkpink text-softblack" : "bg-white/80 text-gray-400 hover:bg-milkpink hover:text-softblack"
          }`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={14} fill={inWishlist ? "currentColor" : "none"} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-inter text-gray-400 mb-1">{product.category}</p>
        <h3 className="font-nunito font-700 text-softblack text-sm leading-tight mb-2 hover:text-pink-dark transition-colors duration-200 line-clamp-2 cursor-pointer" onClick={() => router.push(`/product/${product.id}`)}>  
            {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
            />
          ))}
          <span className="text-xs text-gray-400 font-inter ml-1">({product.reviewCount})</span>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-nunito font-800 text-softblack text-base">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 font-inter line-through ml-1.5">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <button
            id={`add-to-cart-${product.id}`}
            onClick={() => addToCart(product)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              inCart
                ? "bg-pink-dark text-white"
                : "bg-milkpink text-softblack hover:bg-pink-dark hover:text-white"
            }`}
            aria-label={inCart ? "In cart" : "Add to cart"}
          >
            <ShoppingBag size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
