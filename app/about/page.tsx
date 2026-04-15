import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-hero-gradient py-20">
        <div className="section-wrapper text-center">
          <div className="text-6xl mb-4 animate-float">🌸</div>
          <p className="text-milkpink font-nunito font-700 text-sm tracking-widest uppercase mb-3">Our Story</p>
          <h1 className="font-nunito font-900 text-4xl md:text-5xl text-softblack mb-4 leading-tight">
            Made with Love,<br />One Bead at a Time
          </h1>
          <p className="font-inter text-gray-400 text-base max-w-md mx-auto">
            We believe accessories should feel like a warm hug — soft, personal, and uniquely yours.
          </p>
        </div>
      </div>

      <div className="section-wrapper py-16">
        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="aspect-square rounded-[40px] bg-gradient-to-br from-pink-100 via-beige to-lavender/40 flex flex-col items-center justify-center">
            <span className="text-8xl animate-float">🎀</span>
            <p className="font-nunito font-700 text-gray-400 mt-4">milkbead ✿</p>
          </div>
          <div>
            <h2 className="font-nunito font-900 text-3xl text-softblack mb-4">Hello, I&apos;m Milkbead</h2>
            <div className="space-y-4 font-inter text-gray-500 text-sm leading-relaxed">
              <p>
                Milkbead started as a tiny passion project — stringing beads at my desk while watching anime, gifting handmade bracelets to friends, and realizing that there was magic in creating something with your hands.
              </p>
              <p>
                What started as a hobby grew into something bigger. Every piece is still made by hand, with carefully chosen beads, charms, and a whole lot of love. No machines, no shortcuts — just scissors, thread, and passion.
              </p>
              <p>
                Our pieces are designed for the soft girl, the kawaii lover, the aesthetic girlies, and anyone who believes that accessories don&apos;t have to be serious. They can be cozy, cute, and full of personality.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-nunito font-800 text-3xl text-softblack">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { emoji: "✋", title: "100% Handmade", desc: "Every piece is crafted by hand. No factories, no mass production." },
              { emoji: "💖", title: "Made with Love", desc: "We pour care into every bead, charm, and knot." },
              { emoji: "🌱", title: "Small Business", desc: "Supporting Milkbead means supporting a real person with a dream." },
              { emoji: "🎀", title: "Custom Orders", desc: "Can't find what you want? We'll make it just for you." },
            ].map((v) => (
              <div key={v.title} className="card p-6 text-center hover:-translate-y-1 transition-transform duration-300">
                <span className="text-4xl block mb-3">{v.emoji}</span>
                <h3 className="font-nunito font-700 text-softblack mb-2">{v.title}</h3>
                <p className="font-inter text-xs text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-pink-light via-beige to-lavender/30 rounded-[32px] p-12">
          <span className="text-5xl block mb-4">💌</span>
          <h2 className="font-nunito font-900 text-2xl md:text-3xl text-softblack mb-3">
            Ready to find your new favourite accessory?
          </h2>
          <p className="font-inter text-gray-400 text-sm mb-6">
            From necklaces to phone charms — there&apos;s something for every aesthetic.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/shop" className="btn-primary px-8 py-4 text-base">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn-secondary px-8 py-4 text-base">
              Custom Order 🎀
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
