import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAuth() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  const adminEmail = (
    process.env.ADMIN_EMAIL ||
    process.env.NEXT_PUBLIC_ADMIN_USERNAME ||
    "admin@kamaykainan.com"
  ).toLowerCase();
  const isAdminByRole = user.app_metadata?.role === "admin";
  const isAdminByEmail = (user.email || "").toLowerCase() === adminEmail;

  if (!isAdminByRole && !isAdminByEmail) {
    redirect("/");
  }

  return user;
}
