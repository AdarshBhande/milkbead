"use client";

import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <span className="text-8xl block mb-4 animate-bounce-soft">🛍️</span>
          <h1 className="font-nunito font-900 text-3xl text-softblack mb-2">Your cart is empty</h1>
          <p className="font-inter text-gray-400 text-sm mb-8">
            Looks like you haven&apos;t added anything yet. Let&apos;s fix that! 💖
          </p>
          <Link href="/shop" className="btn-primary text-base px-8 py-4">
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal >= 499 ? 0 : 60;
  const total = cartTotal + shipping;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-light via-beige to-lavender/30 py-10">
        <div className="section-wrapper">
          <h1 className="font-nunito font-900 text-3xl md:text-4xl text-softblack mb-1">Your Cart 🛍️</h1>
          <p className="font-inter text-sm text-gray-400">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="section-wrapper py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Link href="/shop" className="flex items-center gap-1 text-sm font-nunito font-semibold text-gray-400 hover:text-pink-dark transition-colors">
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-sm font-nunito font-semibold text-gray-400 hover:text-rose-400 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {cartItems.map((item) => (
              <div key={item.product.id} className="card p-4 flex gap-4 group">
                {/* Product Image */}
                <Link href={`/product/${item.product.id}`} className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-100 to-beige flex items-center justify-center overflow-hidden relative">
                    {item.product.images?.length > 0 ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">
                        {{ Necklaces: "✨", Bracelets: "💫", Earrings: "🌸", Keychains: "🔑", Bows: "🎀", Rings: "💍", "Phone Charms": "📱" }[item.product.category] || "✨"}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-inter text-gray-400">{item.product.category}</p>
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="font-nunito font-700 text-softblack text-sm leading-tight hover:text-pink-dark transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="flex-shrink-0 p-1.5 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-50 transition-all duration-200"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg border border-pink-light flex items-center justify-center hover:bg-pink-light transition-colors text-sm"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-nunito font-700 text-softblack text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg border border-pink-light flex items-center justify-center hover:bg-pink-light transition-colors text-sm"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price */}
                    <p className="font-nunito font-800 text-softblack">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-nunito font-800 text-xl text-softblack mb-5">Order Summary</h2>

              <div className="space-y-3 pb-4 border-b border-pink-100">
                <div className="flex justify-between font-inter text-sm text-gray-500">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-softblack">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between font-inter text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-green-500" : "text-softblack"}`}>
                    {shipping === 0 ? "FREE 🎉" : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs font-inter text-pink-dark bg-pink-light rounded-xl px-3 py-2">
                    Add ₹{499 - cartTotal} more for free shipping! 🚚
                  </p>
                )}
              </div>

              <div className="flex justify-between font-nunito font-800 text-lg text-softblack py-4">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <Link
                href="/checkout"
                id="proceed-to-checkout-btn"
                className="w-full flex items-center justify-center gap-2 bg-milkpink text-softblack font-nunito font-700 py-4 rounded-2xl hover:bg-pink-dark hover:text-white hover:scale-105 hover:shadow-soft-glow transition-all duration-300"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <p className="text-center font-inter text-xs text-gray-400 mt-3">
                🔒 Secure checkout with Razorpay
              </p>

              {/* Accepted payments */}
              <div className="flex justify-center gap-2 mt-4">
                {["UPI", "Card", "Net Banking", "COD"].map((p) => (
                  <span key={p} className="text-xs font-nunito font-semibold bg-beige text-gray-500 px-2 py-1 rounded-lg">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
