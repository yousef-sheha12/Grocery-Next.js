import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItemType } from "./types";

type CartState = {
  items: CartItemType[];
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
  addItem: (newItem: Omit<CartItemType, "subtotal">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
};

const calculateNewTotals = (items: CartItemType[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.2; // 20% tax
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totals: { subtotal: 0, tax: 0, total: 0 },
      addItem: (newItem) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.meal.id === newItem.meal.id,
          );
          const subtotal = newItem.unit_price * newItem.quantity;
          let updatedItems;
          if (existingIndex > -1) {
            updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + newItem.quantity,
              subtotal:
                updatedItems[existingIndex].unit_price *
                (updatedItems[existingIndex].quantity + newItem.quantity),
            };
          } else {
            updatedItems = [...state.items, { ...newItem, subtotal }];
          }
          return { items: updatedItems, totals: calculateNewTotals(updatedItems) };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          const updatedItems = state.items
            .map((item) =>
              item.meal.id === id
                ? { ...item, quantity, subtotal: item.unit_price * quantity }
                : item,
            )
            .filter((item) => item.quantity > 0);
          return { items: updatedItems, totals: calculateNewTotals(updatedItems) };
        }),
      removeItem: (id) =>
        set((state) => {
          const updatedItems = state.items.filter((item) => item.meal.id !== id);
          return { items: updatedItems, totals: calculateNewTotals(updatedItems) };
        }),
      clearCart: () =>
        set({ items: [], totals: { subtotal: 0, tax: 0, total: 0 } }),
      calculateTotals: () =>
        set((state) => {
          const subtotal = state.items.reduce(
            (sum, item) => sum + item.subtotal,
            0,
          );
          const tax = subtotal * 0.2; // 20% tax
          const total = subtotal + tax;
          return { totals: { subtotal, tax, total } };
        }),
    }),
    {
      name: "grocery-cart-local",
    },
  ),
);
