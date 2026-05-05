"use client";

import { useState } from "react";
import { Send, Mail, MessageSquare, User, CheckCircle } from "lucide-react";
import { submitContactMessage } from "@/lib/firestore";
import toast from "react-hot-toast";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ContactPage() {
  useScrollReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContactMessage({
        name: form.name,
        email: form.email,
        message: form.message,
      });
      setSubmitted(true);
      toast.success("Message sent! We'll reply soon 💖");
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #FDE8F2 0%, #F8C8DC 40%, #E6D6FF 100%)", backgroundSize: "300% 300%", animation: "gradientShift 6s ease infinite" }}>
        <div className="text-center animate-zoom-in">
          {/* Success ring */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-28 h-28 rounded-full bg-milkpink flex items-center justify-center shadow-soft-glow animate-ripple">
              <CheckCircle size={56} className="text-pink-dark" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-2 -right-2 text-3xl" style={{ animation: "bounceSoft 2s ease-in-out infinite" }}>🌸</div>
            <div className="absolute -bottom-2 -left-2 text-2xl" style={{ animation: "float 3s ease-in-out infinite" }}>✨</div>
          </div>
          <h2 className="font-nunito font-900 text-3xl text-softblack mb-2 animate-fade-up">Message Sent! 🌸</h2>
          <p className="font-inter text-gray-400 text-sm mb-8 animate-fade-up delay-100">
            Thank you for reaching out! We&apos;ll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-primary animate-fade-up delay-200"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white page-transition">
      {/* Header */}
      <div className="relative overflow-hidden py-16" style={{ background: "linear-gradient(135deg, #FDE8F2 0%, #F8C8DC 35%, #EFD9FF 70%, #F5E6D3 100%)", backgroundSize: "400% 400%", animation: "gradientShift 8s ease infinite" }}>
        {/* Blobs */}
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-40" style={{ background: "radial-gradient(circle, #E6D6FF, transparent 70%)", animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #F8C8DC, transparent 70%)", animation: "float 8s ease-in-out infinite", animationDelay: "1s" }} />

        {/* Floating emojis */}
        {["💌", "✨", "🌸", "💖"].map((e, i) => (
          <div
            key={i}
            className="absolute hidden md:block text-3xl pointer-events-none"
            style={{
              top: `${20 + i * 20}%`,
              left: i % 2 === 0 ? `${4 + i * 2}%` : undefined,
              right: i % 2 !== 0 ? `${4 + i * 2}%` : undefined,
              animation: `float ${3 + i * 0.6}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {e}
          </div>
        ))}

        <div className="section-wrapper text-center relative z-10">
          <p className="text-milkpink font-nunito font-700 text-sm tracking-widest uppercase mb-2 animate-fade-up">Say Hello 👋</p>
          <h1 className="font-nunito font-900 text-3xl md:text-4xl text-softblack mb-3 animate-fade-up delay-100">Get in Touch</h1>
          <p className="font-inter text-gray-400 text-sm max-w-md mx-auto animate-fade-up delay-200">
            Have a custom order request, question, or just want to say hi? We&apos;d love to hear from you! 💖
          </p>
        </div>
      </div>

      <div className="section-wrapper py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Left — Info */}
          <div className="reveal-left">
            <h2 className="font-nunito font-800 text-2xl text-softblack mb-6">
              Custom Orders Welcome! 🎀
            </h2>
            <p className="font-inter text-gray-500 text-sm leading-relaxed mb-8">
              We love making custom pieces! Whether it&apos;s a bracelet in your favourite colors, a personalised keychain, or a set for your bestie — we can make it happen.
            </p>

            <div className="space-y-4">
              {[
                { icon: <Mail size={18} />, label: "Email Us", value: "bhandeadarsh2006@gmail.com" },
                { icon: "📸", label: "Instagram", value: "@milkbeads.co" },
                { icon: "⏱️", label: "Response Time", value: "Within 24 hours" },
                { icon: "🚚", label: "Delivery", value: "Pan India (3–7 days)" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 p-4 card hover:-translate-y-1 hover:shadow-soft-lg transition-all duration-300 group"
                  style={{ animation: "fadeUp 0.5s ease-out both", animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-11 h-11 rounded-xl bg-pink-light flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 group-hover:bg-milkpink transition-all duration-300">
                    {typeof item.icon === "string" ? item.icon : <span className="text-pink-dark">{item.icon}</span>}
                  </div>
                  <div>
                    <p className="font-nunito font-700 text-sm text-softblack">{item.label}</p>
                    <p className="font-inter text-xs text-gray-400">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom order features */}
            <div className="mt-8 p-5 rounded-3xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FDE8F2 0%, #E6D6FF 100%)" }}>
              <h3 className="font-nunito font-700 text-softblack mb-3">Custom Order Options 🌸</h3>
              <ul className="space-y-2">
                {["Choose your beads & colors", "Add name/initials", "Personalised charms", "Gift box wrapping", "Bulk orders for events"].map((item, i) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 font-inter text-sm text-gray-500"
                    style={{ animation: "fadeUp 0.4s ease-out both", animationDelay: `${i * 0.07}s` }}
                  >
                    <span className="text-milkpink" style={{ animation: "heartbeat 1.5s ease-in-out infinite", animationDelay: `${i * 0.3}s` }}>♡</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — Form */}
          <div className="reveal-right">
            <div className="card p-8 relative overflow-hidden hover:shadow-soft-lg transition-shadow duration-300">
              {/* Subtle corner decoration */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-pink-light/40 blur-xl pointer-events-none" />

              <h2 className="font-nunito font-800 text-xl text-softblack mb-6">Send a Message 💌</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { id: "contact-name-input", icon: <User size={14} />, label: "Your Name *", type: "text", key: "name", placeholder: "Priya Sharma", required: true },
                  { id: "contact-email-input", icon: <Mail size={14} />, label: "Email Address *", type: "email", key: "email", placeholder: "your@email.com", required: true },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="flex items-center gap-2 font-nunito font-700 text-sm text-softblack mb-1.5">
                      {field.icon} {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="input-field transition-all duration-300 focus:scale-[1.01]"
                      required={field.required}
                    />
                  </div>
                ))}

                <div>
                  <label className="flex items-center gap-2 font-nunito font-700 text-sm text-softblack mb-1.5">
                    <MessageSquare size={14} /> Your Message / Custom Request *
                  </label>
                  <textarea
                    id="contact-message-input"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you'd like! E.g., 'I'd love a pink beaded bracelet with a butterfly charm, approx 17cm...'"
                    className="input-field resize-none transition-all duration-300 focus:scale-[1.01]"
                    rows={5}
                    required
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-milkpink text-softblack font-nunito font-700 py-4 rounded-2xl hover:bg-pink-dark hover:text-white hover:shadow-soft-glow hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 animate-ripple"
                >
                  {loading ? (
                    <span className="animate-pulse-soft flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-pink-dark/60 animate-bounce" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message 💌
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
