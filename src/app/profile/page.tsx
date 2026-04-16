import { ProfilePanel } from "@/components/profile-panel";
import { requireAuth } from "@/lib/auth";

export default async function ProfilePage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Account</p>
        <h1 className="font-serif text-4xl font-bold text-kape-900">Profile</h1>
      </section>
      <ProfilePanel />
    </div>
  );
}
