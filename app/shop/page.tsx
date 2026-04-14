"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown, X, Search, Loader2 } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { getProducts } from "@/lib/firestore";
import { Product, Category, CATEGORIES } from "@/types";

const PRICE_RANGES = [
  { label: "Under ₹200", min: 0, max: 200 },
  { label: "₹200 – ₹400", min: 200, max: 400 },
  { label: "₹400 – ₹600", min: 400, max: 600 },
  { label: "₹600+", min: 600, max: Infinity },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as Category | null;
  const initialBadge = searchParams.get("badge");
  const initialSearch = searchParams.get("search") || "";

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ✅ Fetch real products from Firestore
  useEffect(() => {
    const load = async () => {
      try {
        const prods = await getProducts();
        setAllProducts(prods);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setProductsLoading(false);
      }
    };
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (initialBadge && !selectedCategory) {
      result = result.filter((p) => p.badge === initialBadge);
    }
    if (selectedPriceRange) {
      result = result.filter(
        (p) => p.price >= selectedPriceRange.min && p.price < selectedPriceRange.max
      );
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.includes(q))
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // createdAt can be a Firestore Timestamp, a string, or missing
        result.sort((a, b) => {
          const toMs = (val: any) => {
            if (!val) return 0;
            if (typeof val?.toMillis === "function") return val.toMillis(); // Firestore Timestamp
            if (typeof val?.toDate === "function") return val.toDate().getTime(); // Firestore Timestamp alt
            if (typeof val === "string") return new Date(val).getTime();
            if (typeof val === "number") return val;
            return 0;
          };
          return toMs(b.createdAt) - toMs(a.createdAt);
        });
    }

    return result;
  }, [allProducts, selectedCategory, selectedPriceRange, sortBy, searchQuery, initialBadge]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedPriceRange(null);
    setSearchQuery("");
  };

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) + (selectedPriceRange ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="py-10" style={{ background: "linear-gradient(90deg, #FDE8F2 0%, #F5E6D3 50%, rgba(230,214,255,0.3) 100%)" }}>
        <div className="section-wrapper">
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#F8C8DC", fontSize: "0.875rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            🛍️ All Products
          </p>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2.25rem", color: "#333333", marginBottom: "0.5rem" }}>
            {selectedCategory || "Shop Everything"}
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "#9ca3af" }}>
            {productsLoading ? "Loading..." : `${filteredProducts.length} items found`}
          </p>
        </div>
      </div>

      <div className="section-wrapper py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters — Desktop */}
          <div className="hidden md:block flex-shrink-0 w-64">
            <FilterPanel
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPriceRange={selectedPriceRange}
              setSelectedPriceRange={setSelectedPriceRange}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onClear={clearFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </div>

          {/* Products Area */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              {/* Mobile Filter Button */}
              <button
                id="mobile-filter-btn"
                onClick={() => setFiltersOpen(true)}
                className="md:hidden flex items-center gap-2 btn-secondary py-2 px-4 text-sm"
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#F8C8DC", color: "#333333" }}>
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="flex items-center gap-2 ml-auto">
                <label className="hidden sm:block text-sm" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "#333333" }}>
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    id="shop-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 rounded-xl border-2 bg-white text-sm cursor-pointer focus:outline-none"
                    style={{ borderColor: "#FDE8F2", fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "#333333" }}
                  >
                    {SORT_OPTIONS.map((op) => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9ca3af" }} />
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 rounded-full text-xs px-3 py-1.5" style={{ backgroundColor: "#F8C8DC", color: "#333333", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory(null)}><X size={12} /></button>
                  </span>
                )}
                {selectedPriceRange && (
                  <span className="inline-flex items-center gap-1 rounded-full text-xs px-3 py-1.5" style={{ backgroundColor: "#E6D6FF", color: "#333333", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
                    {PRICE_RANGES.find((r) => r.min === selectedPriceRange.min && r.max === selectedPriceRange.max)?.label}
                    <button onClick={() => setSelectedPriceRange(null)}><X size={12} /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 rounded-full text-xs px-3 py-1.5" style={{ backgroundColor: "#F5E6D3", color: "#333333", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
                    &ldquo;{searchQuery}&rdquo;
                    <button onClick={() => setSearchQuery("")}><X size={12} /></button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-xs underline" style={{ fontFamily: "Nunito, sans-serif", color: "#9ca3af" }}>
                  Clear all
                </button>
              </div>
            )}

            {/* Loading state */}
            {productsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-milkpink" size={32} />
                <p className="font-nunito font-700 text-gray-400 text-sm">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-6xl block mb-4">🔍</span>
                <h3 className="text-xl mb-2" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#333333" }}>
                  {allProducts.length === 0 ? "No products added yet" : "No products found"}
                </h3>
                <p className="text-sm mb-6" style={{ fontFamily: "Inter, sans-serif", color: "#9ca3af" }}>
                  {allProducts.length === 0
                    ? "Add products from the admin panel to get started."
                    : "Try adjusting your filters"}
                </p>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto" style={{ animation: "slideInRight 0.3s ease-out" }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "#FDE8F2" }}>
              <h3 className="text-lg" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#333333" }}>Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="p-2 rounded-xl" style={{ backgroundColor: "#FDE8F2" }}>
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel
                selectedCategory={selectedCategory}
                setSelectedCategory={(cat) => { setSelectedCategory(cat); setFiltersOpen(false); }}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={setSelectedPriceRange}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onClear={clearFilters}
                activeFiltersCount={activeFiltersCount}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================================
// Filter Panel Component
// ================================
interface FilterPanelProps {
  selectedCategory: Category | null;
  setSelectedCategory: (cat: Category | null) => void;
  selectedPriceRange: { min: number; max: number } | null;
  setSelectedPriceRange: (range: { min: number; max: number } | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onClear: () => void;
  activeFiltersCount: number;
}

function FilterPanel({ selectedCategory, setSelectedCategory, selectedPriceRange, setSelectedPriceRange, searchQuery, setSearchQuery, onClear, activeFiltersCount }: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#333333" }}>Search</h3>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-9 text-sm" />
        </div>
      </div>
      <div>
        <h3 className="mb-3" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#333333" }}>Category</h3>
        <div className="space-y-1.5">
          <button onClick={() => setSelectedCategory(null)} className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-200" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, backgroundColor: !selectedCategory ? "#F8C8DC" : "transparent", color: "#333333" }}>
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)} className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-200" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, backgroundColor: selectedCategory === cat ? "#F8C8DC" : "transparent", color: selectedCategory === cat ? "#333333" : "#6b7280" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#333333" }}>Price Range</h3>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => (
            <button key={range.label} onClick={() => setSelectedPriceRange(selectedPriceRange?.min === range.min ? null : { min: range.min, max: range.max })} className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-200" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, backgroundColor: selectedPriceRange?.min === range.min ? "#E6D6FF" : "transparent", color: selectedPriceRange?.min === range.min ? "#333333" : "#6b7280" }}>
              {range.label}
            </button>
          ))}
        </div>
      </div>
      {activeFiltersCount > 0 && (
        <button onClick={onClear} className="w-full text-center text-sm underline" style={{ fontFamily: "Nunito, sans-serif", color: "#9ca3af" }}>
          Clear all filters
        </button>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-milkpink" size={32} />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
