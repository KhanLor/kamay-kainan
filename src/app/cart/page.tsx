import { CartView } from "@/components/cart-view";

export default function CartPage() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Your Selection</p>
        <h1 className="font-serif text-4xl font-bold text-kape-900">Cart</h1>
      </section>
      <CartView />
    </div>
  );
}
