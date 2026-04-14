"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      try {
        const { auth } = await import("@/lib/firebase");
        const { onAuthStateChanged } = await import("firebase/auth");

        unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
          setFirebaseUser(fbUser);
          if (fbUser) {
            try {
              const tokenResult = await fbUser.getIdTokenResult();
              setUser({
                id: fbUser.uid,
                name: fbUser.displayName || "Milkbead Lover",
                email: fbUser.email || "",
                photoURL: fbUser.photoURL || undefined,
                isAdmin: !!tokenResult.claims.admin,
              });
            } catch {
              setUser({
                id: fbUser.uid,
                name: fbUser.displayName || "Milkbead Lover",
                email: fbUser.email || "",
              });
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } catch (error) {
        console.warn("Auth initialization:", error);
        setLoading(false);
      }
    };

    initAuth();

    return () => { if (unsubscribe) unsubscribe(); };
  }, [mounted]);

  const signIn = async (email: string, password: string) => {
    const { auth } = await import("@/lib/firebase");
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const { auth } = await import("@/lib/firebase");
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
  };

  const signInWithGoogle = async () => {
    const { auth } = await import("@/lib/firebase");
    const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    const { auth } = await import("@/lib/firebase");
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signIn, signUp, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
