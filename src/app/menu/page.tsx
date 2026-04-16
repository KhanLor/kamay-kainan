import { MenuGrid } from "@/components/menu-grid";

export default function MenuPage() {
  return (
    <div className="space-y-6 motion-stack">
      <section className="rounded-3xl border border-kape-200/70 bg-gradient-to-br from-white to-cream-100 p-6 shadow-sm motion-card sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Freshly Cooked</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-kape-900">Our Menu</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-kape-700 sm:text-base">
          Discover signature Filipino dishes crafted with local ingredients and bold home-style flavors.
        </p>
      </section>
      <MenuGrid />
    </div>
  );
}
