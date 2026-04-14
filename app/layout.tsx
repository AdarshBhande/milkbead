import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Milkbead — Handmade Kawaii Jewelry & Accessories",
  description:
    "Shop handmade kawaii beaded jewelry — necklaces, bracelets, earrings, keychains, bows, rings & phone charms. Cute, cozy, and aesthetic. Delivery across India 🇮🇳",
  keywords: ["milkbead", "handmade jewelry", "kawaii", "beaded bracelet", "soft girl", "aesthetic jewelry India"],
  openGraph: {
    title: "Milkbead — Handmade Kawaii Jewelry",
    description: "Soft things you'll never want to take off 🌸",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${inter.variable}`}>
      <body className="font-inter bg-white text-softblack antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AnnouncementBar />
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 600,
                    background: "#FFFFFF",
                    color: "#333333",
                    border: "1px solid #F8C8DC",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(248, 200, 220, 0.4)",
                  },
                  success: {
                    iconTheme: {
                      primary: "#F8C8DC",
                      secondary: "#333333",
                    },
                  },
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
