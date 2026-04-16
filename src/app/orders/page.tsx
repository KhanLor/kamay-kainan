import { OrderHistory } from "@/components/order-history";
import { requireAuth } from "@/lib/auth";

export default async function OrdersPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Realtime</p>
        <h1 className="font-serif text-4xl font-bold text-kape-900">Order History</h1>
      </section>
      <OrderHistory />
    </div>
  );
}
