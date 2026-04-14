"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getAllOrders, updateOrderStatus } from "@/lib/firestore";
import { Order, OrderStatus } from "@/types";
import { ArrowLeft, Search, Loader2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-500",
  confirmed: "bg-purple-100 text-purple-600",
  processing: "bg-amber-100 text-amber-600",
  shipped: "bg-blue-100 text-blue-600",
  delivered: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-500",
};

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Admin guard
  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
    if (!authLoading && user && !user.isAdmin) router.push("/");
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    if (!user?.isAdmin) return;
    setDataLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err: any) {
      console.error("Orders fetch error:", err);
      toast.error("Failed to load orders: " + (err?.message || "Permission denied"));
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) fetchOrders();
  }, [user]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update local state immediately for a snappy UI
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as OrderStatus } : o))
      );
      toast.success(`Order status updated to "${newStatus}" ✅`);
    } catch (err: any) {
      toast.error("Failed to update status: " + (err?.message || "Check permissions"));
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    const customerName = o.address?.name || o.guestEmail || "";
    const orderId = o.id || "";
    const matchSearch =
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus ? o.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  const formatDate = (val: any) => {
    if (!val) return "—";
    // Firestore Timestamp
    if (val?.toDate) return val.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    // ISO string
    if (typeof val === "string") return new Date(val).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    return "—";
  };

  const getProductNames = (order: Order) => {
    if (!order.products?.length) return "—";
    return order.products.map((item) => `${item.product.name} ×${item.quantity}`).join(", ");
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-milkpink" size={32} />
          <p className="font-nunito font-700 text-gray-400 text-sm">Loading orders from Firebase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-pink-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 rounded-xl hover:bg-pink-light transition-colors">
              <ArrowLeft size={18} className="text-softblack" />
            </Link>
            <div>
              <h1 className="font-nunito font-800 text-xl text-softblack">Orders</h1>
              <p className="font-inter text-xs text-gray-400">{orders.length} real orders from Firestore</p>
            </div>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 text-sm font-nunito font-700 text-gray-400 hover:text-softblack transition-colors"
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Status Summary Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          {STATUS_OPTIONS.map((status) => {
            const count = orders.filter((o) => o.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(filterStatus === status ? "" : status)}
                className={`card p-3 text-center hover:-translate-y-0.5 transition-all duration-200 ${
                  filterStatus === status ? "ring-2 ring-milkpink" : ""
                }`}
              >
                <p className="font-nunito font-800 text-xl text-softblack">{count}</p>
                <p className="font-inter text-xs text-gray-400 capitalize">{status}</p>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field sm:w-auto"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>

        {/* Orders Table */}
        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">📋</span>
              <p className="font-nunito font-700 text-softblack mb-1">
                {orders.length === 0 ? "No orders yet" : "No orders match your search"}
              </p>
              <p className="font-inter text-sm text-gray-400">
                {orders.length === 0
                  ? "When customers place orders, they'll appear here."
                  : "Try a different search or filter."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-pink-light/30">
                  <tr>
                    {["Order ID", "Customer", "Items", "Amount", "Method", "Date", "Status"].map((h) => (
                      <th key={h} className="font-nunito font-700 text-softblack text-sm px-4 py-3 text-left whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order.id} className="border-t border-gray-50 hover:bg-pink-light/10 transition-colors">
                      {/* Order ID */}
                      <td className="px-4 py-3 font-nunito font-700 text-softblack text-sm whitespace-nowrap">
                        #{order.id?.slice(-6).toUpperCase()}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <p className="font-nunito font-700 text-softblack text-sm">
                          {order.address?.name || "Guest"}
                        </p>
                        <p className="font-inter text-xs text-gray-400">
                          {order.guestEmail || ""}
                        </p>
                        {order.address?.phone && (
                          <p className="font-inter text-xs text-gray-400">{order.address.phone}</p>
                        )}
                      </td>

                      {/* Items */}
                      <td className="px-4 py-3 font-inter text-sm text-gray-500 max-w-[200px]">
                        <span className="line-clamp-2 text-xs">{getProductNames(order)}</span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 font-nunito font-700 text-softblack text-sm whitespace-nowrap">
                        ₹{order.total?.toLocaleString("en-IN")}
                      </td>

                      {/* Method */}
                      <td className="px-4 py-3">
                        <span className={`text-xs font-nunito font-700 px-2 py-1 rounded-full ${
                          order.paymentMethod === "cod"
                            ? "bg-beige text-gray-500"
                            : "bg-lavender text-softblack"
                        }`}>
                          {order.paymentMethod === "cod" ? "COD" : "Online"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 font-inter text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Status — editable dropdown */}
                      <td className="px-4 py-3">
                        {updatingId === order.id ? (
                          <Loader2 size={16} className="animate-spin text-milkpink" />
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`text-xs font-nunito font-700 px-2 py-1.5 rounded-full border-0 cursor-pointer outline-none ${STATUS_COLORS[order.status]}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s} className="bg-white text-softblack capitalize">
                                {s}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delivery Address Detail - shown below table */}
        {filtered.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-nunito font-700 text-softblack">Delivery Addresses</h3>
            {filtered.map((order) => (
              order.address && (
                <div key={order.id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-nunito font-700 text-softblack text-sm">
                      #{order.id?.slice(-6).toUpperCase()} — {order.address.name}
                    </p>
                    <p className="font-inter text-xs text-gray-400 mt-0.5">
                      📦 {order.address.line1}
                      {order.address.line2 ? `, ${order.address.line2}` : ""},&nbsp;
                      {order.address.city}, {order.address.state} – {order.address.pincode}
                    </p>
                    <p className="font-inter text-xs text-gray-400">📞 {order.address.phone}</p>
                  </div>
                  <span className={`text-xs font-nunito font-700 px-2.5 py-1 rounded-full capitalize self-start ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
