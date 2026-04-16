import { create } from "zustand";
import { persist } from "zustand/middleware";

import { CartLine, MenuItem } from "@/types/app";

type CartState = {
  lines: CartLine[];
  addItem: (item: MenuItem) => void;
  decreaseItem: (itemId: number) => void;
  removeItem: (itemId: number) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.lines.find((line) => line.item.id === item.id);
          if (existing) {
            return {
              lines: state.lines.map((line) =>
                line.item.id === item.id
                  ? { ...line, quantity: line.quantity + 1 }
                  : line,
              ),
            };
          }
          return { lines: [...state.lines, { item, quantity: 1 }] };
        }),
      decreaseItem: (itemId) =>
        set((state) => ({
          lines: state.lines
            .map((line) =>
              line.item.id === itemId
                ? { ...line, quantity: Math.max(0, line.quantity - 1) }
                : line,
            )
            .filter((line) => line.quantity > 0),
        })),
      removeItem: (itemId) =>
        set((state) => ({
          lines: state.lines.filter((line) => line.item.id !== itemId),
        })),
      clear: () => set({ lines: [] }),
      totalItems: () => get().lines.reduce((sum, line) => sum + line.quantity, 0),
      totalPrice: () =>
        get().lines.reduce((sum, line) => sum + line.quantity * line.item.price, 0),
    }),
    {
      name: "kamay-kainan-cart",
    },
  ),
);
