"use client";

export default function AnnouncementBar() {
  const message = "✨ Handmade with love 💖 | Free shipping on orders above ₹499 🛍️ | Delivery across India 🇮🇳 | Handmade with love 💖 | Free shipping on orders above ₹499 🛍️ | Delivery across India 🇮🇳 | ";

  return (
    <div
      className="overflow-hidden h-9 flex items-center"
      style={{ background: "linear-gradient(270deg, #F8C8DC, #E6D6FF, #F5E6D3, #F8C8DC)", backgroundSize: "300% 300%", animation: "gradientShift 5s ease infinite" }}
    >
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="text-sm font-nunito font-semibold tracking-wide px-4 text-softblack">
          {message}
        </span>
        <span className="text-sm font-nunito font-semibold tracking-wide px-4 text-softblack" aria-hidden>
          {message}
        </span>
      </div>
    </div>
  );
}
