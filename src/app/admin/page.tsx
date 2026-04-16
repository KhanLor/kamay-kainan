import { AdminDashboard } from "@/components/admin-dashboard";
import { requireAdmin } from "@/lib/auth";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Restricted Area</p>
        <h1 className="font-serif text-4xl font-bold text-kape-900">Admin Dashboard</h1>
      </section>
      <AdminDashboard />
    </div>
  );
}
