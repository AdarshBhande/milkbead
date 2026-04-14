"use client";

export default function AnnouncementBar() {
  const message = "✨ Handmade with love 💖 | Free shipping on orders above ₹499 🛍️ | Delivery across India 🇮🇳 | Handmade with love 💖 | Free shipping on orders above ₹499 🛍️ | Delivery across India 🇮🇳 | ";

  return (
    <div className="bg-milkpink text-softblack overflow-hidden h-9 flex items-center">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="text-sm font-nunito font-semibold tracking-wide px-4">
          {message}
        </span>
        <span className="text-sm font-nunito font-semibold tracking-wide px-4" aria-hidden>
          {message}
        </span>
      </div>
    </div>
  );
}
