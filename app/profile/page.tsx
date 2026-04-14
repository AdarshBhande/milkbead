"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getOrdersByUser } from "@/lib/firestore";
import { Order } from "@/types";
import { ShoppingBag, LogOut, User, ChevronRight, Loader2, Package } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const userOrders = await getOrdersByUser(user.id);
        setOrders(userOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out! See you soon 🌸");
      router.push("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const statusColors: Record<string, string> = {
    delivered: "bg-green-100 text-green-600",
    shipped: "bg-blue-100 text-blue-600",
    processing: "bg-amber-100 text-amber-600",
    confirmed: "bg-purple-100 text-purple-600",
    cancelled: "bg-red-100 text-red-500",
    pending: "bg-gray-100 text-gray-500",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-milkpink" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-light via-beige to-lavender/30 py-10">
        <div className="section-wrapper">
          <h1 className="font-nunito font-900 text-3xl md:text-4xl text-softblack">My Account</h1>
          <p className="font-inter text-sm text-gray-500 mt-1">Welcome back, {user?.name?.split(" ")[0]} 🌸</p>
        </div>
      </div>

      <div className="section-wrapper py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Profile Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-milkpink flex items-center justify-center mb-4 shadow-soft-glow">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <User size={36} className="text-softblack" />
                  )}
                </div>
                <h2 className="font-nunito font-800 text-xl text-softblack">{user?.name}</h2>
                <p className="font-inter text-sm text-gray-400">{user?.email}</p>
                {user?.isAdmin && (
                  <span className="mt-2 text-xs font-nunito font-700 bg-lavender text-softblack px-3 py-1 rounded-full">
                    ✨ Admin
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {user?.isAdmin && (
                  <Link
                    href="/admin"
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-pink-light/30 transition-colors font-nunito font-700 text-softblack text-sm"
                  >
                    <span className="flex items-center gap-2">🛠️ Admin Dashboard</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </Link>
                )}
                <Link
                  href="/shop"
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-pink-light/30 transition-colors font-nunito font-700 text-softblack text-sm"
                >
                  <span className="flex items-center gap-2"><ShoppingBag size={16} /> Continue Shopping</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-rose-50 transition-colors font-nunito font-700 text-rose-500 text-sm"
                >
                  <span className="flex items-center gap-2"><LogOut size={16} /> Sign Out</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right — Order History */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h3 className="font-nunito font-700 text-lg text-softblack mb-5 flex items-center gap-2">
                <Package size={18} /> Order History
              </h3>

              {ordersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-milkpink" size={24} />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-4xl mb-3">🛍️</p>
                  <p className="font-nunito font-700 text-softblack mb-1">No orders yet</p>
                  <p className="font-inter text-sm text-gray-400 mb-4">Discover our handmade kawaii collection!</p>
                  <Link href="/shop" className="btn-primary inline-flex">Shop Now</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-pink-100 rounded-2xl p-4 hover:bg-pink-light/10 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-nunito font-700 text-softblack text-sm">
                            Order #{order.id?.slice(-6).toUpperCase()}
                          </p>
                          <p className="font-inter text-xs text-gray-400 mt-0.5">
                            {order.products?.length || 0} item(s) · ₹{order.total?.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <span className={`text-xs font-nunito font-700 px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-500"}`}>
                          {order.status}
                        </span>
                      </div>
                      {order.address && (
                        <p className="font-inter text-xs text-gray-400">
                          📦 {order.address.line1}, {order.address.city}, {order.address.state}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
