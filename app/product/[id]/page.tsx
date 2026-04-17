"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ShoppingBag, Heart, Star, ChevronLeft, ChevronRight, Share2, Truck, Shield, RotateCcw, Loader2 } from "lucide-react";
import Link from "next/link";
import { getProductById, getProducts } from "@/lib/firestore";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/shop/ProductCard";

const categoryGradients: Record<string, string> = {
  MAYURI: "from-pink-100 via-rose-50 to-pink-50",
  Bracelets: "from-purple-100 via-lavender to-purple-50",
  Earrings: "from-yellow-50 via-amber-50 to-yellow-100",
  Keychains: "from-blue-50 via-cyan-50 to-blue-100",
  Bows: "from-pink-100 via-fuchsia-50 to-rose-50",

  Rings: "from-amber-50 via-yellow-50 to-orange-50",
  "Phone Charms": "from-teal-50 via-emerald-50 to-teal-100",
};

const categoryEmojis: Record<string, string> = {
  MAYURI: "✨", Bracelets: "💫", Earrings: "🌸",
  Keychains: "🔑", Bows: "🎀", Rings: "💍", "Phone Charms": "📱",
};

export default function ProductPage() {
  const params = useParams();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch product from Firestore
  useEffect(() => {
    const load = async () => {
      try {
        const prod = await getProductById(params.id as string);
        setProduct(prod);
        if (prod) {
          // Fetch related products (same category)
          const all = await getProducts();
          setRelated(all.filter((p) => p.category === prod.category && p.id !== prod.id).slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [params.id]);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-milkpink" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🔍</span>
        <h1 className="font-nunito font-800 text-2xl text-softblack">Product not found</h1>
        <Link href="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);
  const gradient = categoryGradients[product.category] || "from-pink-50 to-beige";
  const emoji = categoryEmojis[product.category] || "✨";

  const badgeColors: Record<string, string> = {
    NEW: "badge-new",
    BESTSELLER: "badge-bestseller",
    SALE: "bg-rose-100 text-rose-600 text-xs font-nunito font-700 px-2.5 py-1 rounded-full",
  };

  const mockReviews = [
    { id: 1, name: "Priya S.", rating: 5, comment: "Absolutely obsessed! The quality is amazing and it looks exactly like the photos.", date: "2 days ago", avatar: "P" },
    { id: 2, name: "Ananya K.", rating: 5, comment: "Super cute and well made. Packaging was so aesthetic too! Will definitely order again.", date: "1 week ago", avatar: "A" },
    { id: 3, name: "Rhea M.", rating: 4, comment: "Really pretty! Shipping was fast. Highly recommend Milkbead 💖", date: "2 weeks ago", avatar: "R" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-pink-light/30 py-3">
        <div className="section-wrapper">
          <nav className="flex items-center gap-2 text-sm font-inter text-gray-400">
            <Link href="/" className="hover:text-pink-dark transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-pink-dark transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-pink-dark transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-softblack font-semibold truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="section-wrapper py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className={`relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br ${gradient}`}>
              {product.images?.[currentImage] ? (
                <img
                  src={product.images[currentImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If image fails, show emoji fallback
                    (e.target as HTMLImageElement).style.display = "none";
                    const fallback = document.getElementById(`img-fallback-${product.id}`);
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : null}
              {/* Emoji fallback — shown when no image or image fails to load */}
              <div
                id={`img-fallback-${product.id}`}
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ display: product.images?.[currentImage] ? "none" : "flex" }}
              >
                <span className="text-8xl animate-float">{emoji}</span>
                <p className="text-sm font-nunito font-semibold text-gray-400 mt-4">{product.category}</p>
              </div>

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className={badgeColors[product.badge]}>{product.badge}</span>
                </div>
              )}

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-soft transition-all duration-200 hover:scale-110 ${inWishlist ? "bg-milkpink text-softblack" : "bg-white/80 text-gray-400"
                  }`}
              >
                <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
              </button>

              {/* Nav arrows if multiple images */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((c) => (c - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentImage((c) => (c + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails — show small preview of each image */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${i === currentImage ? "border-milkpink shadow-soft" : "border-transparent hover:border-pink-light"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).parentElement!.style.background = "#fce4ec";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Dot indicators for single image */}
            {product.images.length <= 1 && product.images.length > 0 && (
              <div className="flex justify-center">
                <div className="w-6 h-2 bg-milkpink rounded-full" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-nunito font-semibold text-sm text-pink-dark mb-1">{product.category}</p>
              <h1 className="font-nunito font-900 text-3xl text-softblack leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                  ))}
                </div>
                <span className="font-nunito font-semibold text-softblack text-sm">{product.rating}</span>
                <span className="font-inter text-xs text-gray-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-nunito font-900 text-4xl text-softblack">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="font-inter text-xl text-gray-300 line-through">₹{product.originalPrice}</span>
                  <span className="bg-rose-100 text-rose-600 text-sm font-nunito font-bold px-2.5 py-1 rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="font-inter text-gray-500 leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs font-nunito font-semibold bg-beige text-gray-500 px-2.5 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="font-nunito font-700 text-softblack text-sm mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-xl border-2 border-pink-light flex items-center justify-center font-nunito font-bold hover:bg-pink-light transition-colors"
                >
                  −
                </button>
                <span id="product-quantity" className="font-nunito font-700 text-softblack w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-xl border-2 border-pink-light flex items-center justify-center font-nunito font-bold hover:bg-pink-light transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="product-add-to-cart-btn"
                onClick={() => addToCart(product, quantity)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-nunito font-700 text-base transition-all duration-300 hover:scale-105 ${inCart ? "bg-pink-dark text-white shadow-soft-glow" : "bg-milkpink text-softblack hover:bg-pink-dark hover:text-white hover:shadow-soft-glow"
                  }`}
              >
                <ShoppingBag size={20} />
                {inCart ? "Added to Cart ✓" : "Add to Cart"}
              </button>
              <button
                id="product-wishlist-btn"
                onClick={() => toggleWishlist(product)}
                className={`flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border-2 font-nunito font-700 text-base transition-all duration-300 hover:scale-105 ${inWishlist ? "border-milkpink bg-milkpink text-softblack" : "border-pink-light hover:border-milkpink hover:bg-pink-light"
                  }`}
              >
                <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
              </button>
              <button className="flex items-center justify-center px-5 py-4 rounded-2xl border-2 border-pink-light hover:border-milkpink hover:bg-pink-light transition-all duration-300">
                <Share2 size={20} className="text-softblack" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: <Truck size={16} />, text: "Free shipping above ₹499" },
                { icon: <Shield size={16} />, text: "Secure payments" },
                { icon: <RotateCcw size={16} />, text: "Easy returns" },
              ].map((b) => (
                <div key={b.text} className="flex flex-col items-center gap-1.5 bg-pink-light/50 rounded-2xl p-3 text-center">
                  <span className="text-pink-dark">{b.icon}</span>
                  <p className="font-inter text-xs text-gray-500 leading-tight">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="sticky-cart-bar md:hidden flex items-center gap-3">
          <div>
            <p className="font-nunito font-700 text-softblack text-sm line-clamp-1">{product.name}</p>
            <p className="font-nunito font-800 text-pink-dark">₹{product.price}</p>
          </div>
          <button
            onClick={() => addToCart(product, quantity)}
            className="ml-auto flex items-center gap-2 bg-milkpink text-softblack font-nunito font-700 px-6 py-3 rounded-2xl hover:bg-pink-dark hover:text-white transition-all duration-300"
          >
            <ShoppingBag size={18} />
            Add to Cart
          </button>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="font-nunito font-800 text-2xl text-softblack mb-6">Customer Reviews</h2>
          <div className="grid gap-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="card p-5 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-milkpink flex items-center justify-center font-nunito font-bold text-softblack flex-shrink-0">
                  {review.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-nunito font-700 text-softblack text-sm">{review.name}</p>
                    <p className="font-inter text-xs text-gray-400">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                    ))}
                  </div>
                  <p className="font-inter text-sm text-gray-500">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-nunito font-800 text-2xl text-softblack mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
