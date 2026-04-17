"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getAllOrders, getProducts, addProduct, deleteProduct } from "@/lib/firestore";
import { Product, Order } from "@/types";
import { Package, ShoppingBag, Users, IndianRupee, Plus, Settings, BarChart2, Loader2, Database, Brush } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const SEED_PRODUCTS = [
    { name: "Pearl Dream Necklace", price: 349, originalPrice: 499, category: "Necklaces" as const, images: ["/images/products/necklace-1.jpg", "/images/products/necklace-1b.jpg"], description: "A delicate pearl necklace with tiny star charms. Handmade with real freshwater pearls and silver-plated chain. Perfect for everyday wear.", badge: "BESTSELLER" as const, rating: 4.8, reviewCount: 124, inStock: true, tags: ["pearl", "star", "minimal"], createdAt: "2024-12-01" },
    { name: "Teddy Bear Pendant Chain", price: 299, category: "Necklaces" as const, images: ["/images/products/necklace-2.jpg"], description: "An adorable teddy bear pendant on a dainty chain. Hand-painted and sealed with gloss for lasting shine.", badge: "NEW" as const, rating: 4.9, reviewCount: 67, inStock: true, tags: ["bear", "pendant"], createdAt: "2025-01-15" },
    { name: "Pastel Star Layered Set", price: 549, originalPrice: 699, category: "Necklaces" as const, images: ["/images/products/necklace-3.jpg"], description: "A gorgeous 2-layer necklace set with pastel star and moon charms. Wear together or separately.", badge: "SALE" as const, rating: 4.7, reviewCount: 89, inStock: true, tags: ["layered", "star"], createdAt: "2025-02-10" },
    { name: "Milky Beaded Bracelet", price: 199, category: "Bracelets" as const, images: ["/images/products/bracelet-1.jpg"], description: "Handstrung with soft milk-white beads and delicate gold spacers. Stretchy, stackable, and endlessly charming.", badge: "BESTSELLER" as const, rating: 4.9, reviewCount: 203, inStock: true, tags: ["beaded", "stackable"], createdAt: "2024-11-20" },
    { name: "Pink Crystal Charm Bracelet", price: 249, category: "Bracelets" as const, images: ["/images/products/bracelet-2.jpg"], description: "Rose-pink crystals hand-knotted on an elastic cord with a butterfly charm. Catches the light beautifully.", badge: "NEW" as const, rating: 4.8, reviewCount: 45, inStock: true, tags: ["crystal", "pink"], createdAt: "2025-03-01" },
    { name: "Friendship Charm Bracelet", price: 179, category: "Bracelets" as const, images: ["/images/products/bracelet-3.jpg"], description: "Playful charms on a soft cord — perfect to gift your best friend. Adjustable fit for all wrist sizes.", rating: 4.6, reviewCount: 78, inStock: true, tags: ["friendship", "giftable"], createdAt: "2025-01-05" },
    { name: "Daisy Stud Earrings", price: 149, category: "Earrings" as const, images: ["/images/products/earring-1.jpg"], description: "Tiny daisy flower studs in soft enamel. Lightweight, hypoallergenic posts — perfect for all-day wear.", badge: "BESTSELLER" as const, rating: 4.7, reviewCount: 156, inStock: true, tags: ["daisy", "stud"], createdAt: "2024-10-15" },
    { name: "Star Dangle Earrings", price: 199, category: "Earrings" as const, images: ["/images/products/earring-2.jpg"], description: "Delicate gold-toned star charms that sway as you move. Light as a feather, stunning under any light.", badge: "NEW" as const, rating: 4.8, reviewCount: 34, inStock: true, tags: ["star", "dangle"], createdAt: "2025-02-20" },
    { name: "Plushie Bunny Keychain", price: 129, category: "Keychains" as const, images: ["/images/products/keychain-1.jpg"], description: "A chubby bunny plushie keychain in pastel tones — the perfect bag charm or key accessory.", rating: 4.9, reviewCount: 92, inStock: true, tags: ["bunny", "plushie"], createdAt: "2025-01-10" },
    { name: "Beaded Charm Keychain", price: 149, category: "Keychains" as const, images: ["/images/products/keychain-2.jpg"], description: "Handmade beaded keychain with letter charms — personalise your bag with colour and fun.", badge: "NEW" as const, rating: 4.6, reviewCount: 28, inStock: true, tags: ["beaded", "letter"], createdAt: "2025-03-10" },
    { name: "Satin Coquette Bow", price: 129, category: "Bows" as const, images: ["/images/products/bow-1.jpg"], description: "A wide satin bow on a sturdy claw clip. The coquette aesthetic essential — soft, silky, and photogenic.", badge: "BESTSELLER" as const, rating: 4.8, reviewCount: 187, inStock: true, tags: ["satin", "coquette"], createdAt: "2024-09-01" },
    { name: "Pearl Bow Hair Clip", price: 99, category: "Bows" as const, images: ["/images/products/bow-2.jpg"], description: "A dainty bow clip embellished with tiny faux pearls. Adds an elegant, vintage-inspired touch.", rating: 4.7, reviewCount: 63, inStock: true, tags: ["pearl", "vintage"], createdAt: "2025-01-25" },
    { name: "Butterfly Adjustable Ring", price: 99, category: "Rings" as const, images: ["/images/products/ring-1.jpg"], description: "A delicate butterfly ring in gold-toned brass. Open band fits all sizes — lightweight and ethereal.", badge: "BESTSELLER" as const, rating: 4.6, reviewCount: 74, inStock: true, tags: ["butterfly", "adjustable"], createdAt: "2024-12-15" },
    { name: "Flower Midi Ring Set", price: 199, category: "Rings" as const, images: ["/images/products/ring-2.jpg"], description: "A set of 3 dainty floral midi rings — wear together for a layered boho look or style individually.", badge: "NEW" as const, rating: 4.8, reviewCount: 41, inStock: true, tags: ["floral", "midi", "set"], createdAt: "2025-02-28" },
    { name: "Sanrio Phone Charm", price: 349, category: "Phone Charms" as const, images: ["/images/products/phonecharm-1.jpg"], description: "A fan-favourite character charm on a sturdy lanyard strap. Clips to any phone case — adorable and functional.", badge: "BESTSELLER" as const, rating: 4.9, reviewCount: 211, inStock: true, tags: ["sanrio", "character"], createdAt: "2024-08-01" },
    { name: "Y2K Bow Phone Charm", price: 249, category: "Phone Charms" as const, images: ["/images/products/phonecharm-2.jpg"], description: "A chunky bow charm in glossy acrylic, dangling from a beaded wrist strap. The ultimate Y2K phone accessory.", badge: "NEW" as const, rating: 4.7, reviewCount: 55, inStock: true, tags: ["y2k", "bow"], createdAt: "2025-03-05" },
  ];

  const seedProducts = async () => {
    if (!confirm("This will DELETE all existing products and seed 16 products. Continue?")) return;
    setSeeding(true);
    try {
      // Delete all existing products
      toast.loading("Clearing old products...", { id: "seed" });
      const existing = await getProducts();
      await Promise.all(existing.map((p) => deleteProduct(p.id)));

      // Add all mock products using authenticated addProduct
      toast.loading("Seeding 16 products...", { id: "seed" });
      await Promise.all(SEED_PRODUCTS.map((p) => addProduct(p as any)));

      const prods = await getProducts();
      setProducts(prods);
      toast.success(`✅ ${prods.length} products seeded successfully!`, { id: "seed" });
    } catch (err: any) {
      toast.error("Seed failed: " + (err?.message || "Check admin permissions"), { id: "seed" });
    } finally {
      setSeeding(false);
    }
  };

  // Admin guard
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
    if (!loading && user && !user.isAdmin) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    const fetchData = async () => {
      try {
        const [prods, ords] = await Promise.all([getProducts(), getAllOrders()]);
        setProducts(prods);
        setOrders(ords);
      } catch (err) {
        console.error("Admin fetch error:", err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-milkpink" size={32} />
          <p className="font-nunito font-700 text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const uniqueCustomers = new Set(orders.map((o) => o.userId || o.guestEmail)).size;

  const stats = [
    { label: "Total Products", value: products.length.toString(), icon: <Package size={20} />, color: "bg-milkpink" },
    { label: "Total Orders", value: orders.length.toString(), icon: <ShoppingBag size={20} />, color: "bg-lavender" },
    { label: "Total Customers", value: uniqueCustomers.toString(), icon: <Users size={20} />, color: "bg-beige-dark" },
    { label: "Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: <IndianRupee size={20} />, color: "bg-pink-light" },
  ];

  const statusColors: Record<string, string> = {
    delivered: "bg-green-100 text-green-600",
    shipped: "bg-blue-100 text-blue-600",
    processing: "bg-amber-100 text-amber-600",
    confirmed: "bg-purple-100 text-purple-600",
    cancelled: "bg-red-100 text-red-500",
    pending: "bg-gray-100 text-gray-500",
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Admin Header */}
      <div className="bg-white border-b border-pink-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-milkpink flex items-center justify-center">
              <span className="font-nunito font-bold text-sm text-softblack">M</span>
            </div>
            <div>
              <h1 className="font-nunito font-800 text-softblack text-lg">Milkbead Admin</h1>
              <p className="font-inter text-xs text-gray-400">Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-inter text-gray-400">Signed in as {user?.email}</span>
            <button
              onClick={seedProducts}
              disabled={seeding}
              className="flex items-center gap-1.5 text-xs font-nunito font-700 text-purple-500 hover:text-purple-700 transition-colors disabled:opacity-50"
              title="Seed all 16 mock products into Firestore"
            >
              {seeding ? <Loader2 size={13} className="animate-spin" /> : <Database size={13} />}
              Seed Products
            </button>
            <Link href="/" className="text-sm font-nunito font-semibold text-gray-400 hover:text-pink-dark transition-colors">
              View Store ↗
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="font-nunito font-800 text-2xl text-softblack">
            Good to see you, {user?.name?.split(" ")[0]}! 🌸
          </h2>
          <p className="font-inter text-sm text-gray-400">Here&apos;s what&apos;s happening with your store.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <p className="font-nunito font-900 text-2xl text-softblack">{stat.value}</p>
              <p className="font-inter text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Add Product", icon: <Plus size={18} />, href: "/admin/products", color: "bg-milkpink" },
            { label: "View Orders", icon: <ShoppingBag size={18} />, href: "/admin/orders", color: "bg-lavender" },
            { label: "Custom Designs", icon: <Brush size={18} />, href: "/admin/custom-designs", color: "bg-beige-dark" },
            { label: "Analytics", icon: <BarChart2 size={18} />, href: "/admin/analytics", color: "bg-purple-100" },
            { label: "Settings", icon: <Settings size={18} />, href: "/admin/settings", color: "bg-pink-light" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`${action.color} rounded-2xl p-4 flex flex-col items-center gap-2 hover:-translate-y-1 hover:shadow-soft transition-all duration-200`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
                {action.icon}
              </div>
              <span className="font-nunito font-700 text-softblack text-sm">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-nunito font-700 text-lg text-softblack">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm font-nunito text-pink-dark hover:underline">View all →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="font-inter text-sm text-gray-400 text-center py-6">No orders yet. Share your store! 🛍️</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-pink-100">
                    {["Order ID", "Customer", "Items", "Amount", "Status"].map((h) => (
                      <th key={h} className="font-nunito font-700 text-softblack text-sm pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-pink-light/20 transition-colors">
                      <td className="py-3 pr-4 font-nunito font-700 text-softblack text-sm">#{order.id?.slice(-6).toUpperCase()}</td>
                      <td className="py-3 pr-4 font-inter text-sm text-gray-500">{order.address?.name || order.guestEmail || "Guest"}</td>
                      <td className="py-3 pr-4 font-inter text-sm text-gray-500">{order.products?.length || 0} item(s)</td>
                      <td className="py-3 pr-4 font-nunito font-700 text-softblack text-sm">₹{order.total?.toLocaleString("en-IN")}</td>
                      <td className="py-3">
                        <span className={`text-xs font-nunito font-700 px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-500"}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-nunito font-700 text-lg text-softblack">Products ({products.length})</h3>
            <Link href="/admin/products" className="text-sm font-nunito text-pink-dark hover:underline">Manage products →</Link>
          </div>
          {products.length === 0 ? (
            <p className="font-inter text-sm text-gray-400 text-center py-6">No products yet. Add your first product! ✨</p>
          ) : (
            <div className="space-y-3">
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-pink-light/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-beige flex items-center justify-center flex-shrink-0 text-xl">
                    {{ Necklaces: "✨", Bracelets: "💫", Earrings: "🌸", Keychains: "🔑", Bows: "🎀", Rings: "💍", "Phone Charms": "📱" }[p.category] || "✨"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-nunito font-700 text-softblack text-sm truncate">{p.name}</p>
                    <p className="font-inter text-xs text-gray-400">{p.category} · {p.reviewCount} reviews</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-nunito font-700 text-softblack text-sm">₹{p.price}</p>
                    {p.badge && (
                      <span className="text-xs font-nunito font-700 bg-milkpink text-softblack px-2 py-0.5 rounded-full">{p.badge}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
