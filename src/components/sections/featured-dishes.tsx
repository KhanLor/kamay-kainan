"use client";

import { useMemo } from "react";
import { ShoppingBasket } from "lucide-react";
import toast from "react-hot-toast";

import { MenuItem } from "@/types/app";
import { peso } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

type FeaturedDishesProps = {
  items: MenuItem[];
};

export function FeaturedDishes({ items }: FeaturedDishesProps) {
  const addItem = useCartStore((s) => s.addItem);
  const featured = useMemo(() => items.slice(0, 3), [items]);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">
            Signature Plates
          </p>
          <h2 className="font-serif text-3xl font-semibold text-kape-900">Featured Dishes</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {featured.map((item, index) => (
          <article
            key={item.id}
            className="group overflow-hidden rounded-2xl border border-kape-200 bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="h-48 overflow-hidden">
              <img
                src={item.image_url}
                alt={item.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-xl font-semibold text-kape-900">{item.name}</h3>
                <p className="text-sm font-bold text-kulabo-600">{peso(item.price)}</p>
              </div>
              <p className="text-sm text-kape-700">{item.description}</p>
              <button
                onClick={() => {
                  addItem(item);
                  toast.success(`${item.name} added to cart`);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-kape-900 px-4 py-2 text-sm font-semibold text-cream-50 transition hover:bg-kape-800"
              >
                <ShoppingBasket className="h-4 w-4" /> Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
