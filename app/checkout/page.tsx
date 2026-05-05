"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/lib/firestore";
import { CreditCard, Truck, ChevronRight, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type PaymentMethod = "razorpay" | "cod";
type Step = "address" | "payment" | "review";

interface AddressForm {
  name: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>("address");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState<AddressForm>({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // 🔒 Require login to checkout
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to place an order 🌸");
      router.push("/auth/login?redirect=/checkout");
    }
  }, [user, authLoading, router]);

  // Pre-fill address when user loads
  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const shipping = cartTotal >= 499 ? 0 : 60;
  const total = cartTotal + shipping;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const required: (keyof AddressForm)[] = ["name", "phone", "email", "line1", "city", "state", "pincode"];
    for (const field of required) {
      if (!address[field]) {
        toast.error(`Please fill in ${field}`);
        return;
      }
    }
    if (!/^\d{10}$/.test(address.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }
    setStep("payment");
  };

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Save order to Firestore — strip undefined fields (Firestore rejects them)
  const saveOrder = async (paymentId?: string) => {
    const addressData: Record<string, string> = {
      name: address.name,
      phone: address.phone,
      line1: address.line1,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    };
    if (address.line2 && address.line2.trim()) {
      addressData.line2 = address.line2.trim();
    }

    const orderData: any = {
      userId: user!.id,
      guestEmail: user!.email,
      products: cartItems,
      total,
      status: "confirmed",
      address: addressData,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };
    if (paymentId) {
      orderData.paymentId = paymentId;
    }

    const orderId = await createOrder(orderData);
    return orderId;
  };

  // 📧 Send order confirmation emails (non-blocking — won’t break checkout if it fails)
  const sendOrderEmail = (orderId: string, paymentId?: string) => {
    const payload = {
      orderId,
      customerEmail: address.email,
      customerName: address.name,
      items: cartItems,
      total,
      shipping,
      address,
      paymentMethod,
      paymentId: paymentId ?? null,
      createdAt: new Date().toISOString(),
    };
    fetch("/api/send-order-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => console.warn("Email send failed (non-critical):", err));
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      router.push("/auth/login?redirect=/checkout");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod === "razorpay") {
        const loaded = await loadRazorpay();
        if (!loaded) {
          toast.error("Could not load Razorpay. Please check your connection.");
          setLoading(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
          amount: total * 100, // paise
          currency: "INR",
          name: "Milkbead",
          description: `Order of ${cartItems.length} item${cartItems.length > 1 ? "s" : ""}`,
          image: "/logo.png",
          prefill: {
            name: address.name,
            email: address.email,
            contact: address.phone,
          },
          theme: { color: "#F8C8DC" },
          handler: async (response: any) => {
            try {
              // ✅ Save order to Firestore after payment success
              const orderId = await saveOrder(response.razorpay_payment_id);
              // 📧 Send confirmation emails (fire-and-forget)
              sendOrderEmail(orderId, response.razorpay_payment_id);
              clearCart();
              router.push(`/order-confirmation?order_id=${orderId}&payment_id=${response.razorpay_payment_id}&method=razorpay`);
            } catch (err) {
              console.error("Order save error:", err);
              toast.error("Payment received but order save failed. Please contact support.");
              setLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              toast("Payment cancelled");
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // COD — save to Firestore immediately
        const orderId = await saveOrder();
        // 📧 Send confirmation emails (fire-and-forget)
        sendOrderEmail(orderId);
        clearCart();
        router.push(`/order-confirmation?order_id=${orderId}&method=cod`);
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Show loading while auth is resolving
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-milkpink" size={32} />
      </div>
    );
  }

  // Redirect handled by useEffect — nothing to render for unauthenticated
  if (!user) return null;

  const steps: { id: Step; label: string }[] = [
    { id: "address", label: "Address" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
  ];

  return (
    <div className="min-h-screen bg-white page-transition">
      {/* Header */}
      <div className="relative overflow-hidden py-12" style={{ background: "linear-gradient(135deg, #FDE8F2 0%, #F8C8DC 35%, #EFD9FF 70%, #F5E6D3 100%)", backgroundSize: "400% 400%", animation: "gradientShift 8s ease infinite" }}>
        {/* Blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-40" style={{ background: "radial-gradient(circle, #E6D6FF, transparent 70%)", animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #F8C8DC, transparent 70%)", animation: "float 8s ease-in-out infinite", animationDelay: "1s" }} />
        {/* Floating icons */}
        {["🛒", "✨"].map((e, i) => (
          <div key={i} className="absolute hidden md:block text-2xl pointer-events-none"
            style={{ top: `${20 + i * 40}%`, right: `${5 + i * 5}%`, animation: `float ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>{e}</div>
        ))}
        <div className="section-wrapper relative z-10">
          <h1 className="font-nunito font-900 text-3xl md:text-4xl text-softblack mb-4 animate-fade-up">Checkout</h1>
          {/* Progress Steps */}
          <div className="flex items-center gap-3">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (s.id === "address" || (s.id === "payment" && step === "review")) setStep(s.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-nunito font-700 text-sm transition-all ${
                    step === s.id
                      ? "bg-milkpink text-softblack shadow-soft"
                      : steps.indexOf({ id: step, label: step }) > i
                      ? "bg-white/60 text-softblack"
                      : "bg-white/30 text-gray-400"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/50 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  {s.label}
                </button>
                {i < steps.length - 1 && <ChevronRight size={16} className="text-gray-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-wrapper py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Steps */}
          <div className="lg:col-span-2">
            {/* STEP 1: Address */}
            {step === "address" && (
              <form onSubmit={handleAddressSubmit} className="space-y-5">
                <h2 className="font-nunito font-800 text-xl text-softblack">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Full Name *</label>
                    <input value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} placeholder="Your name" className="input-field" required />
                  </div>
                  <div>
                    <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Phone Number *</label>
                    <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="10-digit mobile" className="input-field" type="tel" maxLength={10} required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Email *</label>
                    <input value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} placeholder="your@email.com" className="input-field" type="email" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Address Line 1 *</label>
                    <input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} placeholder="House no., Street" className="input-field" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Address Line 2 (Optional)</label>
                    <input value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} placeholder="Apartment, Landmark" className="input-field" />
                  </div>
                  <div>
                    <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">City *</label>
                    <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Mumbai" className="input-field" required />
                  </div>
                  <div>
                    <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Pincode *</label>
                    <input value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} placeholder="400001" className="input-field" maxLength={6} required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">State *</label>
                    <select value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="input-field" required>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button id="checkout-address-next-btn" type="submit" className="btn-primary w-full justify-center py-4 text-base">
                  Continue to Payment <ChevronRight size={18} />
                </button>
              </form>
            )}

            {/* STEP 2: Payment */}
            {step === "payment" && (
              <div className="space-y-5">
                <h2 className="font-nunito font-800 text-xl text-softblack">Payment Method</h2>

                {/* Online Payment */}
                <button
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                    paymentMethod === "razorpay" ? "border-milkpink bg-pink-light/30 shadow-soft" : "border-pink-100 hover:border-pink-light"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "razorpay" ? "border-milkpink" : "border-gray-300"}`}>
                    {paymentMethod === "razorpay" && <div className="w-2.5 h-2.5 rounded-full bg-milkpink" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard size={18} className="text-softblack" />
                      <p className="font-nunito font-700 text-softblack">Pay Online</p>
                    </div>
                    <p className="font-inter text-xs text-gray-400 mt-0.5">UPI, Credit/Debit Card, Net Banking via Razorpay</p>
                  </div>
                  <div className="flex gap-1">
                    {["UPI", "VISA"].map((p) => (
                      <span key={p} className="text-xs bg-white rounded-lg px-2 py-1 font-nunito font-bold text-gray-400 border border-gray-100">{p}</span>
                    ))}
                  </div>
                </button>

                {/* COD */}
                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                    paymentMethod === "cod" ? "border-milkpink bg-pink-light/30 shadow-soft" : "border-pink-100 hover:border-pink-light"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-milkpink" : "border-gray-300"}`}>
                    {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-milkpink" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Truck size={18} className="text-softblack" />
                      <p className="font-nunito font-700 text-softblack">Cash on Delivery</p>
                    </div>
                    <p className="font-inter text-xs text-gray-400 mt-0.5">Pay when your order arrives</p>
                  </div>
                  <span className="text-lg">💵</span>
                </button>

                <div className="flex gap-3">
                  <button onClick={() => setStep("address")} className="btn-secondary flex-1 justify-center py-4">
                    ← Back
                  </button>
                  <button
                    id="checkout-payment-next-btn"
                    onClick={() => setStep("review")}
                    className="btn-primary flex-1 justify-center py-4"
                  >
                    Review Order <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review */}
            {step === "review" && (
              <div className="space-y-5">
                <h2 className="font-nunito font-800 text-xl text-softblack">Review Your Order</h2>

                {/* User info */}
                <div className="card p-4 bg-pink-light/20 border border-milkpink/30">
                  <p className="font-nunito font-700 text-softblack text-sm">
                    🌸 Ordering as: <span className="text-pink-dark">{user.name} ({user.email})</span>
                  </p>
                </div>

                {/* Address summary */}
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-nunito font-700 text-softblack">Delivery Address</h3>
                    <button onClick={() => setStep("address")} className="text-xs font-nunito text-pink-dark hover:underline">Edit</button>
                  </div>
                  <p className="font-inter text-sm text-gray-500 leading-loose">
                    {address.name} · {address.phone}<br />
                    {address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />
                    {address.city}, {address.state} – {address.pincode}
                  </p>
                </div>

                {/* Payment summary */}
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-nunito font-700 text-softblack">Payment</h3>
                    <button onClick={() => setStep("payment")} className="text-xs font-nunito text-pink-dark hover:underline">Edit</button>
                  </div>
                  <p className="font-inter text-sm text-gray-500 flex items-center gap-2">
                    {paymentMethod === "razorpay" ? <><CreditCard size={14} /> Online Payment via Razorpay</> : <><Truck size={14} /> Cash on Delivery</>}
                  </p>
                </div>

                {/* Items */}
                <div className="card p-5">
                  <h3 className="font-nunito font-700 text-softblack mb-3">Items ({cartItems.length})</h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-light flex items-center justify-center text-lg overflow-hidden">
                            {item.product.images?.length > 0 ? (
                              <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{{ Necklaces: "✨", Bracelets: "💫", Earrings: "🌸", Keychains: "🔑", Bows: "🎀", Rings: "💍", "Phone Charms": "📱" }[item.product.category] || "✨"}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-nunito font-700 text-softblack text-sm">{item.product.name}</p>
                            <p className="font-inter text-xs text-gray-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-nunito font-700 text-softblack">₹{item.product.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep("payment")} className="btn-secondary flex-1 justify-center py-4">
                    ← Back
                  </button>
                  <button
                    id="place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-milkpink text-softblack font-nunito font-700 py-4 rounded-2xl hover:bg-pink-dark hover:text-white hover:shadow-soft-glow transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" /> Processing...</>
                    ) : (
                      <><Lock size={18} /> Place Order · ₹{total}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-nunito font-800 text-lg text-softblack mb-4">Order Summary</h2>
              <div className="space-y-3 pb-4 border-b border-pink-100">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm font-inter text-gray-500">
                    <span className="line-clamp-1 max-w-[160px]">{item.product.name} × {item.quantity}</span>
                    <span className="font-semibold text-softblack">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-inter text-gray-500">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-500 font-semibold" : "font-semibold text-softblack"}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
              </div>
              <div className="flex justify-between font-nunito font-800 text-lg text-softblack pt-4">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <p className="text-center font-inter text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                <Lock size={12} /> Secured by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
