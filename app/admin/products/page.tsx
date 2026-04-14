"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/lib/firestore";
import { Product, CATEGORIES } from "@/types";
import { Plus, Edit2, Trash2, Search, ArrowLeft, Loader2, Sparkles, Upload, X, ImagePlus } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CATEGORY_EMOJIS: Record<string, string> = {
    Necklaces: "✨", Bracelets: "💫", Earrings: "🌸",
    Keychains: "🔑", Bows: "🎀", Rings: "💍", "Phone Charms": "📱",
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Uploaded image preview, base64 for AI, and actual File for upload
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>("image/jpeg");
  const [imageName, setImageName] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "", price: "", category: "", description: "", badge: "", originalPrice: ""
  });

  // Admin guard
  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
    if (!loading && user && !user.isAdmin) router.push("/");
  }, [user, loading, router]);

  // Fetch real products from Firestore
  useEffect(() => {
    if (!user?.isAdmin) return;
    const fetchProducts = async () => {
      try {
        const prods = await getProducts();
        setProducts(prods);
      } catch (err) {
        toast.error("Failed to load products");
        console.error(err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Image Upload & AI Analysis ──────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setImageName(file.name);
    setImageMime(file.type);
    setImageFile(file); // ← store the actual File for upload later

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
      const base64 = result.split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeImage = async () => {
    if (!imageBase64) {
      toast.error("Please upload an image first");
      return;
    }
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType: imageMime }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "AI analysis failed");
        return;
      }

      const { suggestion } = data;
      // Pre-fill the form with AI suggestions (admin can edit)
      setForm((prev) => ({
        ...prev,
        name: suggestion.name || prev.name,
        description: suggestion.description || prev.description,
        category: suggestion.category || prev.category,
        badge: suggestion.badge || prev.badge,
      }));

      toast.success("✨ AI suggestions applied! Review and edit as needed.");
    } catch (err: any) {
      toast.error("Failed to analyze image: " + (err.message || "Network error"));
    } finally {
      setAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setImageFile(null);
    setImageName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── CRUD ─────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      badge: product.badge || "",
      originalPrice: product.originalPrice?.toString() || "",
    });
    // Show existing image if available
    if (product.images?.[0]) {
      setImagePreview(product.images[0]);
    }
    setShowForm(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setForm({ name: "", price: "", category: "", description: "", badge: "", originalPrice: "" });
    clearImage();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let images = editingProduct?.images || [];

      // Upload image to public/images/products/ via API route
      if (imageFile) {
        toast.loading("Saving image...", { id: "img-upload" });
        const fd = new FormData();
        fd.append("file", imageFile);
        const res = await fetch("/api/upload-image", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Image upload failed");
        images = [data.url]; // e.g. /images/products/necklace-1.jpg
        toast.dismiss("img-upload");
      }

      // Build data — never include undefined (Firestore rejects it)
      const data: any = {
        name: form.name,
        price: Number(form.price),
        category: form.category as Product["category"],
        description: form.description,
        images,
        rating: editingProduct?.rating || 0,
        reviewCount: editingProduct?.reviewCount || 0,
        inStock: editingProduct?.inStock ?? true,
        createdAt: editingProduct?.createdAt || new Date().toISOString(),
      };

      if (form.badge && form.badge.trim()) data.badge = form.badge as Product["badge"];
      if (form.originalPrice && Number(form.originalPrice) > 0) data.originalPrice = Number(form.originalPrice);

      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data } : p)));
        toast.success("Product updated! ✨");
      } else {
        const newId = await addProduct(data);
        setProducts((prev) => [...prev, { id: newId, ...data }]);
        toast.success("Product added! 🌸");
      }
      resetForm();
    } catch (err: any) {
      toast.dismiss("img-upload");
      console.error(err);
      toast.error("Failed to save: " + (err?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-milkpink" size={32} />
          <p className="font-nunito font-700 text-gray-400 text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-pink-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-pink-light transition-colors">
            <ArrowLeft size={18} className="text-softblack" />
          </Link>
          <div>
            <h1 className="font-nunito font-800 text-xl text-softblack">Products</h1>
            <p className="font-inter text-xs text-gray-400">{products.length} products in Firestore</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <button
            id="admin-add-product-btn"
            onClick={() => { setShowForm(true); setEditingProduct(null); resetForm(); setShowForm(true); }}
            className="btn-primary flex-shrink-0"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* ─── Add / Edit Form ─────────────────────────────────── */}
        {showForm && (
          <div className="card p-6 mb-6 animate-fade-in">
            <h3 className="font-nunito font-700 text-lg text-softblack mb-5">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>

            {/* ── AI Image Upload Zone ──────────────────────────── */}
            <div className="mb-6">
              <label className="block font-nunito font-700 text-sm text-softblack mb-2">
                Product Image
                <span className="ml-2 text-xs font-inter text-pink-dark font-normal">
                  ✨ Upload to get AI title & description suggestions
                </span>
              </label>

              {!imagePreview ? (
                /* Drop zone */
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-pink-200 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-milkpink hover:bg-pink-light/20 transition-all duration-200 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-pink-light/50 flex items-center justify-center group-hover:bg-milkpink/30 transition-colors">
                    <ImagePlus size={24} className="text-pink-dark" />
                  </div>
                  <div className="text-center">
                    <p className="font-nunito font-700 text-softblack text-sm">Click to upload product image</p>
                    <p className="font-inter text-xs text-gray-400 mt-1">JPG, PNG, WEBP supported</p>
                  </div>
                  <div className="flex items-center gap-2 bg-lavender/30 px-3 py-1.5 rounded-full">
                    <Sparkles size={13} className="text-purple-500" />
                    <span className="font-nunito font-700 text-xs text-purple-600">AI will suggest title & description</span>
                  </div>
                </button>
              ) : (
                /* Preview + AI button */
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image preview */}
                  <div className="relative w-36 h-36 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-pink-light">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-rose-50 transition-colors"
                    >
                      <X size={12} className="text-rose-500" />
                    </button>
                  </div>

                  {/* AI Analyze panel */}
                  <div className="flex-1 bg-gradient-to-br from-lavender/20 to-pink-light/20 rounded-2xl p-4 flex flex-col justify-between gap-3">
                    <div>
                      <p className="font-nunito font-700 text-softblack text-sm flex items-center gap-2">
                        <Sparkles size={15} className="text-purple-500" />
                        AI Image Analysis
                      </p>
                      <p className="font-inter text-xs text-gray-400 mt-1">
                        {imageName && <span className="font-semibold text-softblack">📎 {imageName}</span>}
                        <br />
                        Grok will analyze your image and suggest a product title, description, and category. You can edit everything after.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAnalyzeImage}
                        disabled={analyzing}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-nunito font-700 text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                      >
                        {analyzing ? (
                          <><Loader2 size={14} className="animate-spin" /> Analyzing...</>
                        ) : (
                          <><Sparkles size={14} /> Analyze with AI</>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 bg-white text-gray-400 font-nunito font-700 text-sm px-3 py-2.5 rounded-xl hover:bg-pink-light border border-pink-100 transition-all"
                      >
                        <Upload size={14} /> Change
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* ── Form Fields ──────────────────────────────────── */}
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">
                  Product Name *
                  {form.name && <span className="ml-2 text-xs text-purple-400 font-inter">✨ AI suggested</span>}
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="Pearl Dream Necklace"
                  required
                />
              </div>

              <div>
                <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Price (₹) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input-field"
                  placeholder="299"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Original Price (₹)</label>
                <input
                  type="number"
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  className="input-field"
                  placeholder="Optional, for sale"
                />
              </div>

              <div>
                <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Badge</label>
                <select
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="input-field"
                >
                  <option value="">None</option>
                  <option value="NEW">NEW</option>
                  <option value="BESTSELLER">BESTSELLER</option>
                  <option value="SALE">SALE</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">
                  Description *
                  {form.description && <span className="ml-2 text-xs text-purple-400 font-inter">✨ AI suggested</span>}
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Describe the product... (or upload an image and click Analyze with AI)"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : (editingProduct ? "Save Changes" : "Add Product")}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── Products Table ───────────────────────────────────── */}
        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-3xl mb-3">✨</p>
              <p className="font-nunito font-700 text-softblack mb-1">No products yet</p>
              <p className="font-inter text-sm text-gray-400">Click &quot;Add Product&quot; to add your first product to Firestore.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-pink-light/30">
                  <tr>
                    {["Product", "Category", "Price", "Badge", "Stock", "Actions"].map((h) => (
                      <th key={h} className="font-nunito font-700 text-softblack text-sm px-4 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-t border-gray-50 hover:bg-pink-light/10 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Product thumbnail */}
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-pink-100 to-beige flex items-center justify-center text-lg">
                            {p.images?.[0] ? (
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <span>{CATEGORY_EMOJIS[p.category] || "✨"}</span>
                            )}
                          </div>
                          <p className="font-nunito font-700 text-softblack text-sm">{p.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-inter text-sm text-gray-500">{p.category}</td>
                      <td className="px-4 py-3">
                        <p className="font-nunito font-700 text-softblack text-sm">₹{p.price}</p>
                        {p.originalPrice && <p className="font-inter text-xs text-gray-300 line-through">₹{p.originalPrice}</p>}
                      </td>
                      <td className="px-4 py-3">
                        {p.badge ? (
                          <span className="text-xs font-nunito font-700 bg-milkpink text-softblack px-2.5 py-1 rounded-full">{p.badge}</span>
                        ) : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-nunito font-700 px-2.5 py-1 rounded-full ${p.inStock ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                          {p.inStock ? "In Stock" : "Out"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            id={`admin-edit-${p.id}`}
                            onClick={() => handleEdit(p)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-softblack hover:bg-pink-light transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            id={`admin-delete-${p.id}`}
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
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
