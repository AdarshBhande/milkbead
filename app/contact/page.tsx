"use client";

import { useState } from "react";
import { Send, Mail, MessageSquare, User, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Replace with actual Firestore submission
      await new Promise((r) => setTimeout(r, 1200));
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
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-milkpink flex items-center justify-center mx-auto mb-6 shadow-soft-glow">
            <CheckCircle size={48} className="text-pink-dark" />
          </div>
          <h2 className="font-nunito font-900 text-3xl text-softblack mb-2">Message Sent! 🌸</h2>
          <p className="font-inter text-gray-400 text-sm mb-8">
            Thank you for reaching out! We&apos;ll get back to you within 24 hours.
          </p>
          <button onClick={() => setSubmitted(false)} className="btn-primary">
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-light via-beige to-lavender/30 py-14">
        <div className="section-wrapper text-center">
          <p className="text-milkpink font-nunito font-700 text-sm tracking-widest uppercase mb-2">Say Hello 👋</p>
          <h1 className="font-nunito font-900 text-3xl md:text-4xl text-softblack mb-3">Get in Touch</h1>
          <p className="font-inter text-gray-400 text-sm max-w-md mx-auto">
            Have a custom order request, question, or just want to say hi? We&apos;d love to hear from you! 💖
          </p>
        </div>
      </div>

      <div className="section-wrapper py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Left — Info */}
          <div>
            <h2 className="font-nunito font-800 text-2xl text-softblack mb-6">
              Custom Orders Welcome! 🎀
            </h2>
            <p className="font-inter text-gray-500 text-sm leading-relaxed mb-8">
              We love making custom pieces! Whether it&apos;s a bracelet in your favourite colors, a personalised keychain, or a set for your bestie — we can make it happen.
            </p>

            <div className="space-y-5">
              {[
                { icon: <Mail size={18} />, label: "Email Us", value: "bhandeadarsh2006@gmail.com" },
                { icon: "📸", label: "Instagram", value: "@milkbeads.co" },
                { icon: "⏱️", label: "Response Time", value: "Within 24 hours" },
                { icon: "🚚", label: "Delivery", value: "Pan India (3–7 days)" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-4 card">
                  <div className="w-10 h-10 rounded-xl bg-pink-light flex items-center justify-center text-lg flex-shrink-0">
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
            <div className="mt-8 p-5 bg-gradient-to-br from-pink-light/50 to-lavender/30 rounded-3xl">
              <h3 className="font-nunito font-700 text-softblack mb-3">Custom Order Options 🌸</h3>
              <ul className="space-y-2">
                {["Choose your beads & colors", "Add name/initials", "Personalised charms", "Gift box wrapping", "Bulk orders for events"].map((item) => (
                  <li key={item} className="flex items-center gap-2 font-inter text-sm text-gray-500">
                    <span className="text-milkpink">♡</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — Form */}
          <div className="card p-8">
            <h2 className="font-nunito font-800 text-xl text-softblack mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 font-nunito font-700 text-sm text-softblack mb-1.5">
                  <User size={14} /> Your Name *
                </label>
                <input
                  id="contact-name-input"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Priya Sharma"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 font-nunito font-700 text-sm text-softblack mb-1.5">
                  <Mail size={14} /> Email Address *
                </label>
                <input
                  id="contact-email-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 font-nunito font-700 text-sm text-softblack mb-1.5">
                  <MessageSquare size={14} /> Your Message / Custom Request *
                </label>
                <textarea
                  id="contact-message-input"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what you'd like! E.g., 'I'd love a pink beaded bracelet with a butterfly charm, approx 17cm...'"
                  className="input-field resize-none"
                  rows={5}
                  required
                />
              </div>
              <button
                id="contact-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-milkpink text-softblack font-nunito font-700 py-4 rounded-2xl hover:bg-pink-dark hover:text-white hover:shadow-soft-glow transition-all duration-300 disabled:opacity-60"
              >
                {loading ? (
                  <span className="animate-pulse-soft">Sending...</span>
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
  );
}
