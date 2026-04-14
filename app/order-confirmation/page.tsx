"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Truck, Home, ArrowRight } from "lucide-react";

function OrderConfirmationContent() {
  const params = useSearchParams();
  const paymentId = params.get("payment_id");
  const method = params.get("method");
  const orderId = `MB${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: "linear-gradient(180deg, #FDE8F2 0%, #FFFFFF 50%, #F5E6D3 100%)" }}>
      {/* Success animation */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F8C8DC", boxShadow: "0 0 20px rgba(248, 200, 220, 0.5)", animation: "scaleIn 0.3s ease-out" }}>
          <CheckCircle size={56} style={{ color: "#F0A0C0" }} strokeWidth={1.5} />
        </div>
        <div className="absolute -top-2 -right-2 text-3xl" style={{ animation: "bounceSoft 2s ease-in-out infinite" }}>🌸</div>
        <div className="absolute -bottom-2 -left-2 text-2xl" style={{ animation: "float 3s ease-in-out infinite" }}>✨</div>
      </div>

      <div className="text-center max-w-md">
        <h1 className="font-nunito text-3xl md:text-4xl text-softblack mb-3" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#333333" }}>
          Order Placed! 🎉
        </h1>
        <p className="font-inter text-gray-500 text-base mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
          Thank you for shopping with Milkbead 💖
        </p>
        <p className="font-inter text-gray-400 text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
          {method === "cod"
            ? "Your order will be prepared and shipped soon. Pay on delivery."
            : "Your payment was successful. Your order is being prepared!"}
        </p>

        {/* Order Details Card */}
        <div className="card p-6 mb-6 text-left">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-inter text-sm text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>Order ID</span>
              <span className="text-softblack text-sm" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#333333" }}>#{orderId}</span>
            </div>
            {paymentId && (
              <div className="flex justify-between">
                <span className="font-inter text-sm text-gray-400">Payment ID</span>
                <span className="text-softblack text-xs" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{paymentId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-inter text-sm text-gray-400">Payment</span>
              <span className="text-softblack text-sm" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
                {method === "cod" ? "Cash on Delivery 💵" : "Online Payment ✓"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-inter text-sm text-gray-400">Delivery</span>
              <span className="text-softblack text-sm" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>3–7 business days</span>
            </div>
          </div>
        </div>

        {/* Tracking Steps */}
        <div className="card p-5 mb-8">
          <h3 className="mb-4 text-softblack" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>What happens next?</h3>
          <div className="space-y-4">
            {[
              { icon: <CheckCircle size={18} />, label: "Order Confirmed", done: true },
              { icon: <Package size={18} />, label: "Being Packed with Love 💖", done: false },
              { icon: <Truck size={18} />, label: "Out for Delivery", done: false },
              { icon: <Home size={18} />, label: "Delivered!", done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: step.done ? "#F8C8DC" : "#f3f4f6", color: step.done ? "#F0A0C0" : "#d1d5db" }}>
                  {step.icon}
                </div>
                <p className="text-sm" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, color: step.done ? "#333333" : "#9ca3af" }}>
                  {step.label}
                </p>
                {step.done && <span className="ml-auto text-xs text-green-500" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <Link href="/shop" id="continue-shopping-btn" className="btn-primary justify-center py-4 text-base" style={{ fontSize: "1rem" }}>
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
          <Link href="/" className="btn-secondary justify-center py-3">
            Back to Home
          </Link>
        </div>

        <p className="font-inter text-xs text-gray-400 mt-6">
          Questions?{" "}
          <a href="mailto:hello@milkbead.in" className="hover:underline" style={{ color: "#F0A0C0" }}>
            hello@milkbead.in
          </a>
        </p>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-4xl animate-pulse-soft">🌸</span>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
