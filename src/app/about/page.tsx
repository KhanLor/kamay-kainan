"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const highlights = [
  {
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=80",
    badge: "Since 2012",
    subBadge: "Serving Filipino favorites",
  },
  {
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
    badge: "Community First",
    subBadge: "Built on warmth and hospitality",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1400&q=80",
    badge: "Modern Heritage",
    subBadge: "Classic recipes, elevated plating",
  },
];

export default function AboutPage() {
  const [index, setIndex] = useState(0);
  const active = useMemo(() => highlights[index], [index]);

  function prevSlide() {
    setIndex((current) => (current - 1 + highlights.length) % highlights.length);
  }

  function nextSlide() {
    setIndex((current) => (current + 1) % highlights.length);
  }

  return (
    <div className="space-y-8 motion-stack">
      <section className="relative overflow-hidden rounded-3xl border border-kape-200 bg-white shadow-sm motion-card">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-kulabo-500/10 via-transparent to-kulabo-300/20" />
        <div className="grid gap-7 p-5 sm:p-8 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative">
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border-2 border-kulabo-500 bg-white/95 p-2 text-kulabo-600 shadow-sm transition hover:bg-cream-100"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="overflow-hidden rounded-3xl border border-kape-200 bg-cream-50">
              <img
                src={active.image}
                alt="Kamay Kainan story highlight"
                className="h-[260px] w-full object-cover sm:h-[420px]"
              />
            </div>

            <div className="absolute bottom-0 right-0 rounded-tl-3xl bg-kulabo-500 px-5 py-4 text-kape-900 shadow-lg">
              <p className="text-2xl font-black leading-none sm:text-3xl">{active.badge}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em]">{active.subBadge}</p>
            </div>

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border-2 border-kulabo-500 bg-white/95 p-2 text-kulabo-600 shadow-sm transition hover:bg-cream-100"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5">
            <p className="inline-flex rounded-full border border-kape-200 bg-cream-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-kape-700">
              About Kamay Kainan
            </p>
            <h1 className="font-serif text-4xl font-bold text-kape-900">Our Story</h1>
            <p className="text-base leading-9 text-kape-700">
              <strong className="text-kape-900">Kamay Kainan</strong> started as a neighborhood kitchen with one clear promise:
              serve joyful Filipino food that feels like home. From our first service to today, we have stayed true to
              local ingredients, classic techniques, and warm hospitality.
            </p>
            <p className="text-base leading-9 text-kape-700">
              Today, our team continues to celebrate regional flavors from <strong className="text-kape-900">Luzon, Visayas, and Mindanao</strong>,
              reimagining beloved dishes while keeping their soul intact. Every plate is prepared with care, generosity,
              and respect for Filipino food culture.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <article className="rounded-2xl border border-kape-200 bg-cream-50 p-3 text-center">
                <p className="text-2xl font-black text-kulabo-600">12+</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-kape-700">Years Serving</p>
              </article>
              <article className="rounded-2xl border border-kape-200 bg-cream-50 p-3 text-center">
                <p className="text-2xl font-black text-kulabo-600">50k+</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-kape-700">Meals Shared</p>
              </article>
              <article className="rounded-2xl border border-kape-200 bg-cream-50 p-3 text-center">
                <p className="text-2xl font-black text-kulabo-600">3</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-kape-700">Island Flavors</p>
              </article>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-kulabo-600 to-kulabo-500 px-6 py-3 text-base font-semibold text-white shadow transition hover:brightness-105"
            >
              Reserve With Us
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3 motion-grid">
        <article className="rounded-2xl border border-kape-200 bg-white p-5 shadow-sm motion-card">
          <h2 className="font-serif text-2xl font-semibold text-kape-900">Mission</h2>
          <p className="mt-2 text-sm leading-7 text-kape-700">Deliver elevated Filipino comfort food with heartfelt service.</p>
        </article>
        <article className="rounded-2xl border border-kape-200 bg-white p-5 shadow-sm motion-card">
          <h2 className="font-serif text-2xl font-semibold text-kape-900">Vision</h2>
          <p className="mt-2 text-sm leading-7 text-kape-700">Become a top destination for modern Filipino dining in Metro Manila.</p>
        </article>
        <article className="rounded-2xl border border-kape-200 bg-white p-5 shadow-sm motion-card">
          <h2 className="font-serif text-2xl font-semibold text-kape-900">Values</h2>
          <p className="mt-2 text-sm leading-7 text-kape-700">Authenticity, hospitality, craftsmanship, and community.</p>
        </article>
      </section>
    </div>
  );
}
