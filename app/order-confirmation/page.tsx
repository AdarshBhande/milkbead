"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Truck, Home, ArrowRight, Loader2 } from "lucide-react";

// Confetti-like sparkle particles
const CONFETTI = [
  { emoji: "🌸", top: "10%", left: "8%", delay: "0s" },
  { emoji: "✨", top: "15%", right: "10%", delay: "0.3s" },
  { emoji: "🎉", top: "5%", left: "45%", delay: "0.6s" },
  { emoji: "💖", bottom: "20%", left: "5%", delay: "0.9s" },
  { emoji: "🎀", bottom: "15%", right: "8%", delay: "0.2s" },
  { emoji: "⭐", top: "40%", left: "3%", delay: "0.5s" },
  { emoji: "🌙", top: "60%", right: "3%", delay: "0.8s" },
];

function OrderConfirmationContent() {
  const params = useSearchParams();
  const paymentId = params.get("payment_id");
  const method = params.get("method");
  const orderId = `MB${Date.now().toString().slice(-6)}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FDE8F2 0%, #F8C8DC 30%, #EFD9FF 65%, #F5E6D3 100%)", backgroundSize: "400% 400%", animation: "gradientShift 8s ease infinite" }}
    >
      {/* Background blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-40" style={{ background: "radial-gradient(circle, #E6D6FF, transparent 70%)", animation: "float 8s ease-in-out infinite" }} />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #F8C8DC, transparent 70%)", animation: "float 6s ease-in-out infinite", animationDelay: "1s" }} />

      {/* Floating confetti particles */}
      {CONFETTI.map((p, i) => (
        <div
          key={i}
          className="absolute text-3xl pointer-events-none"
          style={{
            top: (p as any).top,
            bottom: (p as any).bottom,
            left: (p as any).left,
            right: (p as any).right,
            animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: p.delay,
            filter: "drop-shadow(0 2px 8px rgba(248,200,220,0.4))",
            opacity: visible ? 1 : 0,
            transition: `opacity 0.5s ease ${0.3 + i * 0.1}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Success animation */}
      <div
        className="relative mb-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.5)",
          transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div className="w-28 h-28 rounded-full bg-milkpink flex items-center justify-center animate-ripple shadow-soft-glow">
          <CheckCircle size={56} className="text-pink-dark" strokeWidth={1.5} />
        </div>
        <div className="absolute -top-2 -right-2 text-3xl" style={{ animation: "bounceSoft 2s ease-in-out infinite" }}>🌸</div>
        <div className="absolute -bottom-2 -left-2 text-2xl" style={{ animation: "float 3s ease-in-out infinite" }}>✨</div>
        {/* Pulsing ring */}
        <div className="absolute inset-0 rounded-full border-4 border-milkpink/40 animate-ripple" />
      </div>

      <div className="text-center max-w-md relative z-10">
        <h1
          className="font-nunito text-3xl md:text-4xl text-softblack mb-3"
          style={{
            fontWeight: 900,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
          }}
        >
          Order Placed! 🎉
        </h1>
        <p
          className="font-inter text-gray-500 text-base mb-2"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
          }}
        >
          Thank you for shopping with Milkbead 💖
        </p>
        <p
          className="font-inter text-gray-400 text-sm mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.45s",
          }}
        >
          {method === "cod"
            ? "Your order will be prepared and shipped soon. Pay on delivery."
            : "Your payment was successful. Your order is being prepared!"}
        </p>

        {/* Order Details Card */}
        <div
          className="card p-6 mb-6 text-left hover-lift"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.55s, transform 0.6s ease 0.55s",
          }}
        >
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-inter text-sm text-gray-400">Order ID</span>
              <span className="text-softblack text-sm font-nunito font-700">#{orderId}</span>
            </div>
            {paymentId && (
              <div className="flex justify-between">
                <span className="font-inter text-sm text-gray-400">Payment ID</span>
                <span className="text-softblack text-xs font-nunito font-700">{paymentId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-inter text-sm text-gray-400">Payment</span>
              <span className="text-softblack text-sm font-nunito font-700">
                {method === "cod" ? "Cash on Delivery 💵" : "Online Payment ✓"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-inter text-sm text-gray-400">Delivery</span>
              <span className="text-softblack text-sm font-nunito font-700">3–7 business days</span>
            </div>
          </div>
        </div>

        {/* Tracking Steps */}
        <div
          className="card p-5 mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.65s, transform 0.6s ease 0.65s",
          }}
        >
          <h3 className="mb-4 text-softblack font-nunito font-700">What happens next?</h3>
          <div className="space-y-4">
            {[
              { icon: <CheckCircle size={18} />, label: "Order Confirmed", done: true },
              { icon: <Package size={18} />, label: "Being Packed with Love 💖", done: false },
              { icon: <Truck size={18} />, label: "Out for Delivery", done: false },
              { icon: <Home size={18} />, label: "Delivered!", done: false },
            ].map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-3 group"
                style={{ animation: `fadeUp 0.4s ease-out both`, animationDelay: `${0.7 + i * 0.1}s` }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: step.done ? "#F8C8DC" : "#f3f4f6",
                    color: step.done ? "#F0A0C0" : "#d1d5db",
                    animation: step.done ? "ripplePulse 2s ease-out infinite" : undefined,
                  }}
                >
                  {step.icon}
                </div>
                <p
                  className="text-sm font-nunito font-600 transition-colors duration-300"
                  style={{ color: step.done ? "#333333" : "#9ca3af" }}
                >
                  {step.label}
                </p>
                {step.done && <span className="ml-auto text-xs text-green-500 font-nunito font-700 animate-pop">✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col gap-3"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.85s, transform 0.6s ease 0.85s",
          }}
        >
          <Link href="/shop" id="continue-shopping-btn" className="btn-primary justify-center py-4 text-base animate-ripple">
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
          <Link href="/" className="btn-secondary justify-center py-3 hover:scale-105 transition-transform duration-300">
            Back to Home
          </Link>
        </div>

        <p
          className="font-inter text-xs text-gray-400 mt-6"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 1s" }}
        >
          Questions?{" "}
          <a href="mailto:hello@milkbead.in" className="hover:underline text-pink-dark">
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FDE8F2 0%, #F8C8DC 40%, #E6D6FF 100%)" }}>
        <div className="text-center">
          <span className="text-5xl block mb-4" style={{ animation: "float 2s ease-in-out infinite" }}>🌸</span>
          <Loader2 className="animate-spin text-milkpink mx-auto" size={32} />
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
