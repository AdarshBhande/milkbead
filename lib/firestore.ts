import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Product, Order, Review, ContactMessage } from "@/types";

// ============================================
// PRODUCTS
// ============================================

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Product;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const q = query(collection(db, "products"), where("category", "==", category));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function addProduct(data: Omit<Product, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "products"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, "products", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}

// ============================================
// ORDERS
// NOTE: No orderBy() here — we sort client-side to avoid needing composite indexes
// ============================================

export async function createOrder(data: Omit<Order, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "orders"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  // Simple where query (no orderBy) — no composite index needed
  const q = query(collection(db, "orders"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
  // Sort client-side by createdAt descending
  return orders.sort((a, b) => {
    const aTime = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : 0;
    const bTime = typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

export async function getAllOrders(): Promise<Order[]> {
  // Fetch all orders — no orderBy to avoid needing an index
  const snapshot = await getDocs(collection(db, "orders"));
  const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
  // Sort client-side by createdAt descending
  return orders.sort((a, b) => {
    const aTime = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : 0;
    const bTime = typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await updateDoc(doc(db, "orders", id), { status, updatedAt: serverTimestamp() });
}

// ============================================
// REVIEWS
// NOTE: No orderBy() — sort client-side
// ============================================

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const q = query(collection(db, "reviews"), where("productId", "==", productId));
  const snapshot = await getDocs(q);
  const reviews = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
  return reviews.sort((a, b) => {
    const aTime = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : 0;
    const bTime = typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

export async function addReview(data: Omit<Review, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "reviews"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ============================================
// CONTACT / CUSTOM ORDERS
// ============================================

export async function submitContactMessage(data: ContactMessage): Promise<string> {
  const docRef = await addDoc(collection(db, "contacts"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAllContactMessages(): Promise<ContactMessage[]> {
  const snapshot = await getDocs(collection(db, "contacts"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessage));
}
