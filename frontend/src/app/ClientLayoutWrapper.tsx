"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { PredictiveSearchModal } from "@/components/PredictiveSearchModal";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <main className="flex-grow">{children}</main>
      <CartDrawer />
      <PredictiveSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}