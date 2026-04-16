import Link from "next/link";

import { SITE } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-kape-200 bg-[radial-gradient(circle_at_top_left,#ffd8b0_0%,#fff8ec_45%,#f4e7d1_100%)] p-8 sm:p-12">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-kulabo-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-kape-300/30 blur-2xl" />

      <div className="relative max-w-2xl space-y-5">
        <p className="inline-flex rounded-full bg-kape-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cream-100">
          Modern Filipino Dining
        </p>
        <h1 className="font-serif text-4xl font-bold leading-tight text-kape-900 sm:text-6xl">
          {SITE.slogan}
        </h1>
        <p className="text-base text-kape-700 sm:text-lg">{SITE.description}</p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/menu"
            className="rounded-full bg-kulabo-500 px-6 py-3 text-sm font-semibold text-cream-50 transition hover:scale-[1.02] hover:bg-kulabo-600"
          >
            Order Now
          </Link>
          <Link
            href="/menu"
            className="rounded-full border border-kape-300 bg-cream-50 px-6 py-3 text-sm font-semibold text-kape-800 transition hover:border-kape-500"
          >
            View Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
