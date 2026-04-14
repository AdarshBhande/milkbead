// ============================================================
// Milkbead — Shared TypeScript Types
// ============================================================

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: Category;
  images: string[];
  description: string;
  badge?: "NEW" | "BESTSELLER" | "SALE";
  rating: number;
  reviewCount: number;
  inStock: boolean;
  tags?: string[];
  createdAt?: string;
}

export type Category =
  | "Necklaces"
  | "Bracelets"
  | "Earrings"
  | "Keychains"
  | "Bows"
  | "Rings"
  | "Phone Charms";

export const CATEGORIES: Category[] = [
  "Necklaces",
  "Bracelets",
  "Earrings",
  "Keychains",
  "Bows",
  "Rings",
  "Phone Charms",
];

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  isAdmin?: boolean;
}

export interface Address {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  userId?: string;
  guestEmail?: string;
  products: CartItem[];
  total: number;
  status: OrderStatus;
  address: Address;
  paymentMethod: "razorpay" | "cod";
  paymentId?: string;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  product: string;
}
