"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchApi } from "@/utils/api";

export interface ICartItem {
  _id?: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    thumbnail: string;
    images?: Array<{ url: string; alt: string }>;
    stock: number;
    sellingPrice: number;
    MRP: number;
  };
  variantId?: string;
  variantTitle?: string;
  quantity: number;
  unitPrice: number;
  unitMrp: number;
  lineTotal: number;
}

export interface ICart {
  _id?: string;
  items: ICartItem[];
  couponCode?: string;
  couponDiscount: number;
  shippingFee: number;
  subtotal: number;
  grandTotal: number;
}

interface CartContextType {
  cart: ICart | null;
  itemsCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<string>;
  removeCoupon: () => Promise<void>;
  refreshCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ICart | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    try {
      const res = await fetchApi<{ success: boolean; cart: ICart }>("/cart");
      if (res.success && res.cart) {
        setCart(res.cart);
      }
    } catch (err) {
      console.warn("[Cart] Unable to load cart from server:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addItem = async (productId: string, variantId?: string, quantity = 1) => {
    try {
      const res = await fetchApi<{ success: boolean; cart: ICart; message: string }>("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId, variantId, quantity }),
      });

      if (res.success && res.cart) {
        setCart(res.cart);
        openDrawer();
      }
    } catch (err: any) {
      alert(err.message || "Failed to add item to cart.");
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await fetchApi<{ success: boolean; cart: ICart }>("/cart/items/" + itemId, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });

      if (res.success && res.cart) {
        setCart(res.cart);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update item quantity.");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetchApi<{ success: boolean; cart: ICart }>("/cart/items/" + itemId, {
        method: "DELETE",
      });

      if (res.success && res.cart) {
        setCart(res.cart);
      }
    } catch (err: any) {
      alert(err.message || "Failed to remove item.");
    }
  };

  const applyCoupon = async (code: string): Promise<string> => {
    const res = await fetchApi<{ success: boolean; cart: ICart; message: string }>("/cart/coupon", {
      method: "POST",
      body: JSON.stringify({ code }),
    });

    if (res.success && res.cart) {
      setCart(res.cart);
      return res.message;
    }
    throw new Error("Coupon application failed");
  };

  const removeCoupon = async () => {
    const res = await fetchApi<{ success: boolean; cart: ICart }>("/cart/coupon", {
      method: "DELETE",
    });

    if (res.success && res.cart) {
      setCart(res.cart);
    }
  };

  const itemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemsCount,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        refreshCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};