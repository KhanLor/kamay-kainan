"use client";

import { useEffect, useMemo, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function ProfilePanel() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("customer");
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin@kamaykainan.com").toLowerCase();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const userEmail = user.email || "";
      setEmail(userEmail);
      setRole(userEmail.toLowerCase() === adminEmail ? "admin" : "customer");
    }

    loadProfile();
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="max-w-lg space-y-4 rounded-2xl border border-kape-200 bg-white p-6 motion-card">
      <h2 className="font-serif text-2xl font-semibold text-kape-900">My Profile</h2>
      <p className="text-sm text-kape-700">Email: {email || "Not signed in"}</p>
      <p className="text-sm text-kape-700">Role: {role}</p>
      <div className="flex gap-2">
        <button
          onClick={signOut}
          className="rounded-full bg-kape-900 px-4 py-2 text-sm font-semibold text-cream-50"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
