import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const MOCK_PRODUCTS = [
  // NECKLACES
  {
    name: "Pearl Dream Necklace",
    price: 349, originalPrice: 499, category: "Necklaces",
    images: ["/images/products/necklace-1.jpg", "/images/products/necklace-1b.jpg"],
    description: "A delicate pearl necklace with tiny star charms. Handmade with real freshwater pearls and silver-plated chain. Perfect for everyday wear.",
    badge: "BESTSELLER", rating: 4.8, reviewCount: 124, inStock: true,
    tags: ["pearl", "star", "minimal"], createdAt: "2024-12-01",
  },
  {
    name: "Teddy Bear Pendant Chain",
    price: 299, category: "Necklaces",
    images: ["/images/products/necklace-2.jpg"],
    description: "An adorable teddy bear pendant on a dainty chain. The bear charm is hand-painted and sealed with gloss for lasting shine.",
    badge: "NEW", rating: 4.9, reviewCount: 67, inStock: true,
    tags: ["bear", "pendant", "gifting"], createdAt: "2025-01-15",
  },
  {
    name: "Pastel Star Layered Set",
    price: 549, originalPrice: 699, category: "Necklaces",
    images: ["/images/products/necklace-3.jpg"],
    description: "A gorgeous 2-layer necklace set with pastel star and moon charms. Sold as a set — wear together or separately for custom looks.",
    badge: "SALE", rating: 4.7, reviewCount: 89, inStock: true,
    tags: ["layered", "star", "moon", "pastel"], createdAt: "2025-02-10",
  },
  // BRACELETS
  {
    name: "Milky Beaded Bracelet",
    price: 199, category: "Bracelets",
    images: ["/images/products/bracelet-1.jpg"],
    description: "Handstrung with soft milk-white beads and delicate gold spacers. Stretchy, stackable, and endlessly charming.",
    badge: "BESTSELLER", rating: 4.9, reviewCount: 203, inStock: true,
    tags: ["beaded", "stackable", "minimal"], createdAt: "2024-11-20",
  },
  {
    name: "Pink Crystal Charm Bracelet",
    price: 249, category: "Bracelets",
    images: ["/images/products/bracelet-2.jpg"],
    description: "Rose-pink crystals hand-knotted on an elastic cord with a butterfly charm. Catches the light beautifully.",
    badge: "NEW", rating: 4.8, reviewCount: 45, inStock: true,
    tags: ["crystal", "butterfly", "pink"], createdAt: "2025-03-01",
  },
  {
    name: "Friendship Charm Bracelet",
    price: 179, category: "Bracelets",
    images: ["/images/products/bracelet-3.jpg"],
    description: "Playful charms on a soft cord — perfect to gift your best friend. Adjustable fit for all wrist sizes.",
    rating: 4.6, reviewCount: 78, inStock: true,
    tags: ["friendship", "giftable", "charm"], createdAt: "2025-01-05",
  },
  // EARRINGS
  {
    name: "Daisy Stud Earrings",
    price: 149, category: "Earrings",
    images: ["/images/products/earring-1.jpg"],
    description: "Tiny daisy flower studs in soft enamel. Lightweight, hypoallergenic posts — perfect for all-day wear.",
    badge: "BESTSELLER", rating: 4.7, reviewCount: 156, inStock: true,
    tags: ["daisy", "stud", "floral"], createdAt: "2024-10-15",
  },
  {
    name: "Star Dangle Earrings",
    price: 199, category: "Earrings",
    images: ["/images/products/earring-2.jpg"],
    description: "Delicate gold-toned star charms that sway as you move. Light as a feather, stunning under any light.",
    badge: "NEW", rating: 4.8, reviewCount: 34, inStock: true,
    tags: ["star", "dangle", "gold"], createdAt: "2025-02-20",
  },
  // KEYCHAINS
  {
    name: "Plushie Bunny Keychain",
    price: 129, category: "Keychains",
    images: ["/images/products/keychain-1.jpg"],
    description: "A chubby bunny plushie keychain in pastel tones — the perfect bag charm or key accessory for something soft and sweet.",
    rating: 4.9, reviewCount: 92, inStock: true,
    tags: ["bunny", "plushie", "soft"], createdAt: "2025-01-10",
  },
  {
    name: "Beaded Charm Keychain",
    price: 149, category: "Keychains",
    images: ["/images/products/keychain-2.jpg"],
    description: "Handmade beaded keychain with letter charms — personalise your bag with colour and fun. Mix and match beads.",
    badge: "NEW", rating: 4.6, reviewCount: 28, inStock: true,
    tags: ["beaded", "personalised", "letter"], createdAt: "2025-03-10",
  },
  // BOWS
  {
    name: "Satin Coquette Bow",
    price: 129, category: "Bows",
    images: ["/images/products/bow-1.jpg"],
    description: "A wide satin bow on a sturdy claw clip. The coquette aesthetic essential — soft, silky, and incredibly photogenic.",
    badge: "BESTSELLER", rating: 4.8, reviewCount: 187, inStock: true,
    tags: ["satin", "claw-clip", "coquette"], createdAt: "2024-09-01",
  },
  {
    name: "Pearl Bow Hair Clip",
    price: 99, category: "Bows",
    images: ["/images/products/bow-2.jpg"],
    description: "A dainty bow clip embellished with tiny faux pearls. Adds an elegant, vintage-inspired touch to any hairstyle.",
    rating: 4.7, reviewCount: 63, inStock: true,
    tags: ["pearl", "hair-clip", "vintage"], createdAt: "2025-01-25",
  },
  // RINGS
  {
    name: "Butterfly Adjustable Ring",
    price: 99, category: "Rings",
    images: ["/images/products/ring-1.jpg"],
    description: "A delicate butterfly ring crafted in gold-toned brass. Open band design fits all sizes — lightweight and ethereal.",
    badge: "BESTSELLER", rating: 4.6, reviewCount: 74, inStock: true,
    tags: ["butterfly", "adjustable", "gold"], createdAt: "2024-12-15",
  },
  {
    name: "Flower Midi Ring Set",
    price: 199, category: "Rings",
    images: ["/images/products/ring-2.jpg"],
    description: "A set of 3 dainty floral midi rings — wear them together for a layered boho look or style individually.",
    badge: "NEW", rating: 4.8, reviewCount: 41, inStock: true,
    tags: ["floral", "midi", "set"], createdAt: "2025-02-28",
  },
  // PHONE CHARMS
  {
    name: "Sanrio Phone Charm",
    price: 349, category: "Phone Charms",
    images: ["/images/products/phonecharm-1.jpg"],
    description: "A fan-favourite character charm on a sturdy lanyard strap. Clips to any phone case — adorable and functional.",
    badge: "BESTSELLER", rating: 4.9, reviewCount: 211, inStock: true,
    tags: ["sanrio", "character", "lanyard"], createdAt: "2024-08-01",
  },
  {
    name: "Y2K Bow Phone Charm",
    price: 249, category: "Phone Charms",
    images: ["/images/products/phonecharm-2.jpg"],
    description: "A chunky bow charm in glossy acrylic, dangling from a beaded wrist strap. The ultimate Y2K phone accessory.",
    badge: "NEW", rating: 4.7, reviewCount: 55, inStock: true,
    tags: ["y2k", "bow", "acrylic"], createdAt: "2025-03-05",
  },
];

export async function POST(req: NextRequest) {
  try {
    // Check for a secret key to prevent unauthorized seeding
    const { secret } = await req.json().catch(() => ({ secret: "" }));
    if (secret !== "milkbead_seed_2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all existing products first (optional clean slate)
    const existing = await getDocs(collection(db, "products"));
    const deletePromises = existing.docs.map((d) => deleteDoc(doc(db, "products", d.id)));
    await Promise.all(deletePromises);

    // Add all mock products
    const addPromises = MOCK_PRODUCTS.map((product) =>
      addDoc(collection(db, "products"), product)
    );
    const results = await Promise.all(addPromises);

    return NextResponse.json({
      success: true,
      seeded: results.length,
      message: `✅ ${results.length} products seeded into Firestore successfully!`,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
