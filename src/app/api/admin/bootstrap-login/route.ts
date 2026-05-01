import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

function getAdminEmail() {
  return (
    process.env.ADMIN_EMAIL ||
    process.env.NEXT_PUBLIC_ADMIN_USERNAME ||
    "admin@kamaykainan.com"
  ).trim().toLowerCase();
}

function getAdminPassword() {
  return (
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    "Admin@123456"
  ).trim();
}

function getServiceSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

type BootstrapRequest = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const supabase = getServiceSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Admin bootstrap is not configured. Please set SUPABASE_SERVICE_ROLE_KEY in your environment.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json()) as BootstrapRequest;
  const requestedEmail = (body.email || "").trim().toLowerCase();
  const requestedPassword = (body.password || "").trim();

  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPassword();

  if (requestedEmail !== adminEmail || requestedPassword !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let userId: string | null = null;

    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    const existingUser = usersData.users.find(
      (user) => (user.email || "").toLowerCase() === adminEmail,
    );

    if (existingUser) {
      userId = existingUser.id;
      const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
        password: adminPassword,
        email_confirm: true,
        app_metadata: {
          ...(existingUser.app_metadata || {}),
          role: "admin",
        },
      });

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    } else {
      const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        app_metadata: {
          role: "admin",
        },
      });

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }

      userId = createData.user?.id || null;
    }

    if (userId) {
      const { error: profileError } = await supabase
        .from("users")
        .upsert({ id: userId, email: adminEmail, role: "admin" }, { onConflict: "id" });

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to bootstrap admin account right now." },
      { status: 500 },
    );
  }
}