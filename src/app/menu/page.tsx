import { MenuGrid } from "@/components/menu-grid";

export default function MenuPage() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Freshly Cooked</p>
        <h1 className="font-serif text-4xl font-bold text-kape-900">Our Menu</h1>
      </section>
      <MenuGrid />
    </div>
  );
}
