"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Sparkles } from "lucide-react";

import { MenuItem } from "@/types/app";
import { peso } from "@/lib/utils";

type FeaturedDishesProps = {
  items: MenuItem[];
};

export function FeaturedDishes({ items }: FeaturedDishesProps) {
  const featured = useMemo(() => items.slice(0, 3), [items]);

  return (
    <section className="space-y-4 motion-stack">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">
            Signature Plates
          </p>
          <h2 className="font-serif text-3xl font-semibold text-kape-900">Featured Dishes</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 motion-grid">
        {featured.map((item, index) => (
          <article
            key={item.id}
            className="group overflow-hidden rounded-3xl border border-kape-200/70 bg-white/95 shadow-sm motion-card transition duration-500 hover:shadow-xl"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={item.image_url}
                alt={item.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-kape-700">
                <Sparkles className="h-3.5 w-3.5 text-kulabo-600" /> Chef Pick
              </span>
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-xl font-semibold text-kape-900">{item.name}</h3>
                <p className="text-sm font-bold text-kulabo-600">{peso(item.price)}</p>
              </div>
              <p className="text-sm text-kape-700">{item.description}</p>
              <Link
                href="/menu"
                className="inline-flex items-center rounded-full border border-kape-300 bg-cream-50 px-4 py-2 text-sm font-semibold text-kape-800 transition hover:border-kape-500"
              >
                View Full Menu
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
