"use client";

import { useMemo } from "react";
import toast from "react-hot-toast";

import { useCartStore } from "@/stores/cart-store";
import { peso } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function CartView() {
  const lines = useCartStore((s) => s.lines);
  const addItem = useCartStore((s) => s.addItem);
  const decreaseItem = useCartStore((s) => s.decreaseItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0),
    [lines],
  );

  async function handleCheckout() {
    if (!lines.length) {
      toast.error("Your cart is empty.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Please login first before checkout.");
      return;
    }

    const { data: order, error } = await supabase
      .from("orders")
      .insert({ user_id: user.id, total, status: "pending" })
      .select("id")
      .single();

    if (error || !order) {
      toast.error(error?.message || "Unable to create order.");
      return;
    }

    const orderItems = lines.map((line) => ({
      order_id: order.id,
      menu_item_id: line.item.id,
      quantity: line.quantity,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      toast.error(itemsError.message);
      return;
    }

    toast.success("Order placed successfully.");
    clear();
  }

  return (
    <div className="space-y-5">
      {!lines.length && (
        <div className="rounded-2xl border border-dashed border-kape-300 bg-white p-8 text-center text-kape-700">
          Your cart is empty. Add your favorite dishes from the menu.
        </div>
      )}

      {lines.map((line) => (
        <article
          key={line.item.id}
          className="flex flex-col gap-3 rounded-2xl border border-kape-200 bg-white p-4 sm:flex-row sm:items-center"
        >
          <img
            src={line.item.image_url}
            alt={line.item.name}
            className="h-20 w-full rounded-xl object-cover sm:w-24"
          />
          <div className="flex-1">
            <h3 className="font-serif text-xl font-semibold text-kape-900">{line.item.name}</h3>
            <p className="text-sm text-kape-700">{peso(line.item.price)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => decreaseItem(line.item.id)}
              className="h-8 w-8 rounded-full bg-cream-100 text-kape-900"
            >
              -
            </button>
            <span className="min-w-8 text-center text-sm font-semibold">{line.quantity}</span>
            <button
              onClick={() => addItem(line.item)}
              className="h-8 w-8 rounded-full bg-cream-100 text-kape-900"
            >
              +
            </button>
            <button
              onClick={() => removeItem(line.item.id)}
              className="ml-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
            >
              Remove
            </button>
          </div>
        </article>
      ))}

      <div className="rounded-2xl border border-kape-200 bg-cream-100 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-kape-700">Total</p>
          <p className="font-serif text-2xl font-bold text-kape-900">{peso(total)}</p>
        </div>
        <button
          onClick={handleCheckout}
          className="mt-4 w-full rounded-full bg-kulabo-500 px-4 py-3 text-sm font-semibold text-cream-50 transition hover:bg-kulabo-600"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
