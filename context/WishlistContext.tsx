"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Product } from "@/types";
import toast from "react-hot-toast";

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("milkbead_wishlist");
      if (stored) setWishlistItems(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("milkbead_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      toast.success("Added to wishlist 💖");
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems((prev) => prev.filter((p) => p.id !== productId));
    toast.success("Removed from wishlist");
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      const isIn = prev.find((p) => p.id === product.id);
      if (isIn) {
        toast.success("Removed from wishlist");
        return prev.filter((p) => p.id !== product.id);
      }
      toast.success("Added to wishlist 💖");
      return [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlistItems.some((p) => p.id === productId),
    [wishlistItems]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
