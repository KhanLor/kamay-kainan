"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Category, MenuItem, Order } from "@/types/app";
import { peso } from "@/lib/utils";

type ItemForm = {
  name: string;
  description: string;
  price: string;
  category_id: string;
};

export function AdminDashboard() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [itemForm, setItemForm] = useState<ItemForm>({
    name: "",
    description: "",
    price: "",
    category_id: "",
  });
  const [categoryName, setCategoryName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadData = useCallback(async () => {
    const [categoriesRes, itemsRes, ordersRes] = await Promise.all([
      supabase.from("categories").select("id, name").order("name"),
      supabase
        .from("menu_items")
        .select("id, name, description, price, image_url, category_id")
        .order("id", { ascending: false }),
      supabase
        .from("orders")
        .select("id, user_id, total, status, created_at")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    if (!categoriesRes.error) setCategories((categoriesRes.data || []) as Category[]);
    if (!itemsRes.error) setItems((itemsRes.data || []) as MenuItem[]);
    if (!ordersRes.error) setOrders((ordersRes.data || []) as Order[]);
  }, [supabase]);

  useEffect(() => {
    const initialLoad = setTimeout(() => {
      void loadData();
    }, 0);

    const channel = supabase
      .channel("admin:realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, loadData)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, loadData)
      .subscribe();

    return () => {
      clearTimeout(initialLoad);
      supabase.removeChannel(channel);
    };
  }, [supabase, loadData]);

  async function handleCreateCategory(event: FormEvent) {
    event.preventDefault();
    if (!categoryName.trim()) return;

    const { error } = await supabase.from("categories").insert({ name: categoryName.trim() });
    if (error) {
      toast.error(error.message);
      return;
    }

    setCategoryName("");
    toast.success("Category added.");
    loadData();
  }

  async function handleCreateItem(event: FormEvent) {
    event.preventDefault();

    if (!imageFile) {
      toast.error("Please choose an image.");
      return;
    }

    const filePath = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
    const { error: uploadError } = await supabase.storage
      .from("menu-images")
      .upload(filePath, imageFile, { upsert: true });

    if (uploadError) {
      toast.error(uploadError.message);
      return;
    }

    const { data: publicUrlRes } = supabase.storage
      .from("menu-images")
      .getPublicUrl(filePath);

    const { error } = await supabase.from("menu_items").insert({
      name: itemForm.name,
      description: itemForm.description,
      price: Number(itemForm.price),
      category_id: Number(itemForm.category_id),
      image_url: publicUrlRes.publicUrl,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setItemForm({ name: "", description: "", price: "", category_id: "" });
    setImageFile(null);
    toast.success("Menu item created.");
    loadData();
  }

  async function handleDeleteItem(id: number) {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Menu item deleted.");
    loadData();
  }

  async function handleOrderStatus(orderId: number, status: Order["status"]) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Order status updated.");
    loadData();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-4 rounded-2xl border border-kape-200 bg-white p-5">
        <h2 className="font-serif text-2xl font-semibold text-kape-900">Category Management</h2>
        <form onSubmit={handleCreateCategory} className="flex gap-2">
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="flex-1 rounded-xl border border-kape-300 px-3 py-2"
            placeholder="New category"
            required
          />
          <button className="rounded-xl bg-kape-900 px-4 py-2 text-sm font-semibold text-cream-50">
            Add
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category.id} className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-kape-800">
              {category.name}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-kape-200 bg-white p-5">
        <h2 className="font-serif text-2xl font-semibold text-kape-900">Create Menu Item</h2>
        <form onSubmit={handleCreateItem} className="space-y-3">
          <input
            value={itemForm.name}
            onChange={(e) => setItemForm((s) => ({ ...s, name: e.target.value }))}
            className="w-full rounded-xl border border-kape-300 px-3 py-2"
            placeholder="Item name"
            required
          />
          <textarea
            value={itemForm.description}
            onChange={(e) => setItemForm((s) => ({ ...s, description: e.target.value }))}
            className="w-full rounded-xl border border-kape-300 px-3 py-2"
            placeholder="Description"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={itemForm.price}
              onChange={(e) => setItemForm((s) => ({ ...s, price: e.target.value }))}
              type="number"
              className="w-full rounded-xl border border-kape-300 px-3 py-2"
              placeholder="Price"
              min={1}
              required
            />
            <select
              value={itemForm.category_id}
              onChange={(e) => setItemForm((s) => ({ ...s, category_id: e.target.value }))}
              className="w-full rounded-xl border border-kape-300 px-3 py-2"
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <input
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            type="file"
            accept="image/*"
            className="w-full rounded-xl border border-kape-300 px-3 py-2"
            required
          />
          <button className="rounded-xl bg-kulabo-500 px-4 py-2 text-sm font-semibold text-cream-50">
            Save Item
          </button>
        </form>
      </section>

      <section className="space-y-4 rounded-2xl border border-kape-200 bg-white p-5 lg:col-span-2">
        <h2 className="font-serif text-2xl font-semibold text-kape-900">Menu Items</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="flex gap-3 rounded-xl border border-kape-200 p-3">
              <img src={item.image_url} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-kape-900">{item.name}</p>
                <p className="text-xs text-kape-700">{peso(item.price)}</p>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-kape-200 bg-white p-5 lg:col-span-2">
        <h2 className="font-serif text-2xl font-semibold text-kape-900">Live Orders</h2>
        <div className="space-y-2">
          {orders.map((order) => (
            <article key={order.id} className="flex flex-col gap-3 rounded-xl border border-kape-200 p-3 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="text-sm font-semibold text-kape-900">Order #{order.id}</p>
                <p className="text-xs text-kape-700">{peso(order.total)}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleOrderStatus(order.id, e.target.value as Order["status"])}
                className="rounded-lg border border-kape-300 px-3 py-2 text-sm"
              >
                <option value="pending">pending</option>
                <option value="preparing">preparing</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
