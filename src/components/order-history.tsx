"use client";

import { useEffect, useMemo, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Order } from "@/types/app";
import { peso } from "@/lib/utils";

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("orders")
        .select("id, user_id, total, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setOrders(data as Order[]);
    }

    load();

    const channel = supabase
      .channel("orders:user")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="space-y-3">
      {!orders.length && (
        <div className="rounded-xl border border-dashed border-kape-300 bg-white p-6 text-sm text-kape-700">
          You have no orders yet.
        </div>
      )}

      {orders.map((order) => (
        <article key={order.id} className="rounded-xl border border-kape-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-kape-900">Order #{order.id}</p>
            <span className="rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold text-kape-800">
              {order.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-kape-700">{peso(order.total)}</p>
          <p className="mt-1 text-xs text-kape-500">
            {new Date(order.created_at).toLocaleString("en-PH")}
          </p>
        </article>
      ))}
    </div>
  );
}
