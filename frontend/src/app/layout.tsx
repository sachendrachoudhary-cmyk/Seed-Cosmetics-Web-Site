import type { Metadata } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "Seed Cosmetics | Care Begins Here | Botanical Personal Care",
  description:
    "Pure, potent botanical personal care powered by cold-pressed virgin seed oils and clinical dermatology. Made in India. Free shipping over ₹999.",
  metadataBase: new URL("https://www.seedcosmetics.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Seed Cosmetics | Pure Botanical Science",
    description: "Care Begins Here. Mass-premium skincare and scalp rituals formulated with virgin seed lipids.",
    url: "https://www.seedcosmetics.in",
    siteName: "Seed Cosmetics",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Seed Cosmetics Botanical Personal Care",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className="min-h-screen flex flex-col justify-between selection:bg-botanical/20 selection:text-botanical-dark">
        <AuthProvider>
          <CartProvider>
            <AnnouncementBar />
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}