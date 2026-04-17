"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getAllContactMessages } from "@/lib/firestore";
import { ContactMessage } from "@/types";
import { ArrowLeft, Search, Loader2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCustomDesignsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Admin guard
  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
    if (!authLoading && user && !user.isAdmin) router.push("/");
  }, [user, authLoading, router]);

  const fetchMessages = async () => {
    if (!user?.isAdmin) return;
    setDataLoading(true);
    try {
      const data = await getAllContactMessages();
      // Sort newest first
      data.sort((a, b) => {
        const aTime = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : (a.createdAt as any)?.toMillis?.() || 0;
        const bTime = typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : (b.createdAt as any)?.toMillis?.() || 0;
        return bTime - aTime;
      });
      setMessages(data);
    } catch (err: any) {
      console.error("Messages fetch error:", err);
      toast.error("Failed to load custom designs");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) fetchMessages();
  }, [user]);

  const filtered = messages.filter((m) => {
    const name = m.name?.toLowerCase() || "";
    const email = m.email?.toLowerCase() || "";
    const msg = m.message?.toLowerCase() || "";
    const q = searchQuery.toLowerCase();
    return name.includes(q) || email.includes(q) || msg.includes(q);
  });

  const formatDate = (val: any) => {
    if (!val) return "—";
    if (val?.toDate) return val.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    if (typeof val === "string") return new Date(val).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    return "—";
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-milkpink" size={32} />
          <p className="font-nunito font-700 text-gray-400 text-sm">Loading custom designs...</p>
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
              <h1 className="font-nunito font-800 text-xl text-softblack">Custom Designs & Messages</h1>
              <p className="font-inter text-xs text-gray-400">{messages.length} requests received</p>
            </div>
          </div>
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 text-sm font-nunito font-700 text-gray-400 hover:text-softblack transition-colors"
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9"
            />
          </div>
        </div>

        {/* Messages Table */}
        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">✉️</span>
              <p className="font-nunito font-700 text-softblack mb-1">
                {messages.length === 0 ? "No incoming requests yet" : "No requests match your search"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-pink-light/30">
                  <tr>
                    {["Date", "Customer", "Message Details"].map((h) => (
                      <th key={h} className="font-nunito font-700 text-softblack text-sm px-4 py-3 text-left whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((msg, i) => (
                    <tr key={msg.id || i} className="border-t border-gray-50 hover:bg-pink-light/10 transition-colors">
                      <td className="px-4 py-3 font-inter text-xs text-gray-400 whitespace-nowrap align-top">
                        {formatDate(msg.createdAt)}
                      </td>
                      <td className="px-4 py-3 align-top min-w-[150px]">
                        <p className="font-nunito font-700 text-softblack text-sm">
                          {msg.name}
                        </p>
                        <a href={`mailto:${msg.email}`} className="font-inter text-xs text-pink-dark hover:underline">
                          {msg.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 font-inter text-sm text-gray-600 align-top max-w-lg">
                        <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded-xl text-xs">
                          {msg.message}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
