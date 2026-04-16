"use client";

import Link from "next/link";

import { useCartStore } from "@/stores/cart-store";
import { peso } from "@/lib/utils";

type CartModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CartModal({ open, onClose }: CartModalProps) {
  const lines = useCartStore((s) => s.lines);
  const total = useCartStore((s) => s.totalPrice());

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-kape-950/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-cream-50 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-2xl font-semibold text-kape-900">Your Cart</h3>
          <button onClick={onClose} className="rounded-full bg-cream-100 px-3 py-1 text-sm">
            Close
          </button>
        </div>

        <div className="max-h-80 space-y-2 overflow-y-auto">
          {!lines.length && <p className="text-sm text-kape-700">Your cart is empty.</p>}
          {lines.map((line) => (
            <div key={line.item.id} className="flex items-center justify-between rounded-lg bg-white p-3">
              <p className="text-sm font-semibold text-kape-900">
                {line.item.name} x {line.quantity}
              </p>
              <p className="text-sm text-kulabo-600">{peso(line.item.price * line.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="font-semibold text-kape-900">Total: {peso(total)}</p>
          <Link
            href="/cart"
            onClick={onClose}
            className="rounded-full bg-kulabo-500 px-4 py-2 text-sm font-semibold text-cream-50"
          >
            Go to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
