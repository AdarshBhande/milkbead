import Link from "next/link";
import { Camera, Share2, Play, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "New Arrivals", href: "/shop?badge=NEW" },
    { label: "Bestsellers", href: "/shop?badge=BESTSELLER" },
    { label: "Sale", href: "/shop?badge=SALE" },
  ],
  Info: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Custom Orders", href: "/contact" },
    { label: "Shipping Policy", href: "/shipping-policy" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Return Policy", href: "/return-policy" },
  ],
};

const categories = [
  "Necklaces", "Bracelets", "Earrings", "Keychains", "Bows", "Rings", "Phone Charms"
];

export default function Footer() {
  return (
    <footer className="bg-beige mt-16">
      {/* Top Section */}
      <div className="section-wrapper py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-milkpink flex items-center justify-center">
                <span className="text-lg font-nunito font-bold text-softblack">M</span>
              </div>
              <span className="font-nunito font-800 text-xl text-softblack">milkbead</span>
              <span className="text-milkpink text-xl">✿</span>
            </Link>
            <p className="font-inter text-sm text-gray-500 leading-relaxed mb-4 max-w-xs">
              Soft things you&apos;ll never want to take off. Handmade with love, designed for the aesthetic souls 🌸
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/milkbeads.co"
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: '#F8C8DC' }}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200"
                aria-label="Instagram"
              >
                <Camera size={16} />
              </a>
              <a
                href="#"
                style={{ backgroundColor: '#E6D6FF' }}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200"
                aria-label="Twitter"
              >
                <Share2 size={16} />
              </a>
              <a
                href="#"
                style={{ backgroundColor: '#E8D0B8' }}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200"
                aria-label="YouTube"
              >
                <Play size={16} />
              </a>
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-inter">
                <Mail size={14} className="text-milkpink flex-shrink-0" />
                <span>hello@milkbead.in</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-inter">
                <MapPin size={14} className="text-milkpink flex-shrink-0" />
                <span>Ships across India 🇮🇳</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-nunito font-700 text-softblack mb-4">{section}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-inter text-sm text-gray-500 hover:text-pink-dark transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Categories Bar */}
        <div className="mt-10 pt-6 border-t border-beige-dark">
          <p className="font-nunito font-semibold text-softblack text-sm mb-3">Browse Categories:</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/shop?category=${encodeURIComponent(cat)}`}
                className="px-3 py-1.5 rounded-full bg-white text-xs font-nunito font-semibold text-softblack hover:bg-milkpink hover:scale-105 transition-all duration-200 shadow-sm"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-beige-dark">
        <div className="section-wrapper py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-inter text-xs text-gray-400">
            © {new Date().getFullYear()} Milkbead. Made with 💖 in India. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="font-inter text-xs text-gray-400">🔒</span>
            <span className="font-inter text-xs text-gray-400">Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
