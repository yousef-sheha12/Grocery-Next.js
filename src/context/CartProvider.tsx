"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCartStore } from "@/lib/cartStore";
import { CartItemType } from "@/lib/types";

interface CartContextType {
  items: CartItemType[];
  totals: { subtotal: number; tax: number; total: number };
  addItem: (item: Omit<CartItemType, "subtotal">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useCartStore((state) => state.items);
  const totals = useCartStore((state) => state.totals);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <CartContext.Provider
      value={{ items, totals, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
