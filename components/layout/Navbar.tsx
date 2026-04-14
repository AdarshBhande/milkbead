"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart, Search, User, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES } from "@/types";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/shop", hasDropdown: true },
  { label: "Custom", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCategoryOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-soft"
          : "bg-white border-b border-pink-100"
      }`}
    >
      <nav className="section-wrapper h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-milkpink flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-lg font-nunito font-900 text-softblack">M</span>
          </div>
          <span className="font-nunito font-800 text-xl text-softblack tracking-tight">
            milkbead
          </span>
          <span className="text-milkpink font-nunito text-xl">✿</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div key={link.label} className="relative">
                <button
                  onClick={() => setCategoryOpen((v) => !v)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl font-nunito font-semibold text-sm transition-all duration-200 ${
                    pathname.includes("/shop")
                      ? "text-pink-dark bg-pink-light"
                      : "text-softblack hover:text-pink-dark hover:bg-pink-light"
                  }`}
                >
                  {link.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {categoryOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-pink-100 overflow-hidden animate-fade-in z-50">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        href={`/shop?category=${encodeURIComponent(cat)}`}
                        className="block px-4 py-2.5 text-sm font-nunito font-semibold text-softblack hover:bg-pink-light hover:text-pink-dark transition-colors duration-150"
                        onClick={() => setCategoryOpen(false)}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-2 rounded-xl font-nunito font-semibold text-sm transition-all duration-200 ${
                  pathname === link.href
                    ? "text-pink-dark bg-pink-light"
                    : "text-softblack hover:text-pink-dark hover:bg-pink-light"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <button
            id="navbar-search-btn"
            onClick={() => setSearchOpen((v) => !v)}
            className="relative p-2.5 rounded-xl text-softblack hover:bg-pink-light hover:text-pink-dark transition-all duration-200"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            id="navbar-wishlist-btn"
            className="relative p-2.5 rounded-xl text-softblack hover:bg-pink-light hover:text-pink-dark transition-all duration-200"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-milkpink rounded-full text-[10px] font-nunito font-bold flex items-center justify-center text-softblack leading-none w-5 h-5">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            id="navbar-cart-btn"
            className="relative p-2.5 rounded-xl text-softblack hover:bg-pink-light hover:text-pink-dark transition-all duration-200"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-milkpink rounded-full text-[10px] font-nunito font-bold flex items-center justify-center text-softblack leading-none">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <Link
            href={user ? "/profile" : "/auth/login"}
            id="navbar-profile-btn"
            className="relative p-2.5 rounded-xl text-softblack hover:bg-pink-light hover:text-pink-dark transition-all duration-200"
            aria-label="Profile"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <User size={20} />
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            id="navbar-menu-btn"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2.5 rounded-xl text-softblack hover:bg-pink-light transition-all duration-200"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-pink-100 bg-white px-4 py-3 animate-fade-in">
          <div className="section-wrapper">
            <div className="relative max-w-xl mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="navbar-search-input"
                type="text"
                placeholder="Search for necklaces, bracelets, keychains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-pink-light focus:border-milkpink focus:outline-none font-inter text-sm"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-pink-100 bg-white animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`block px-4 py-3 rounded-2xl font-nunito font-semibold text-base transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-pink-light text-pink-dark"
                    : "text-softblack hover:bg-pink-light hover:text-pink-dark"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-pink-100">
              <p className="text-xs text-gray-400 font-inter px-4 pb-2">Categories</p>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/shop?category=${encodeURIComponent(cat)}`}
                  className="block px-4 py-2 rounded-xl font-nunito text-sm text-softblack hover:bg-pink-light hover:text-pink-dark transition-colors duration-150"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
