"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Category, MenuItem } from "@/types/app";
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
  const [itemForm, setItemForm] = useState<ItemForm>({
    name: "",
    description: "",
    price: "",
    category_id: "",
  });
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ItemForm>({
    name: "",
    description: "",
    price: "",
    category_id: "",
  });
  const [categoryName, setCategoryName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const [categoriesRes, itemsRes] = await Promise.all([
      supabase.from("categories").select("id, name").order("name"),
      supabase
        .from("menu_items")
        .select("id, name, description, price, image_url, category_id")
        .order("id", { ascending: false }),
    ]);

    if (!categoriesRes.error) setCategories((categoriesRes.data || []) as Category[]);
    if (!itemsRes.error) setItems((itemsRes.data || []) as MenuItem[]);
  }, [supabase]);

  useEffect(() => {
    const initialLoad = setTimeout(() => {
      void loadData();
    }, 0);

    const channel = supabase
      .channel("admin:realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, loadData)
      .subscribe();

    return () => {
      clearTimeout(initialLoad);
      supabase.removeChannel(channel);
    };
  }, [supabase, loadData]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  useEffect(() => {
    if (!editImageFile) {
      return;
    }

    const previewUrl = URL.createObjectURL(editImageFile);
    setEditImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [editImageFile]);

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
    setImagePreview(null);
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

  function handleStartEdit(item: MenuItem) {
    setEditingItemId(item.id);
    setEditForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category_id: String(item.category_id),
    });
    setEditImageFile(null);
    setEditImagePreview(item.image_url);
  }

  function handleCancelEdit() {
    setEditingItemId(null);
    setEditForm({ name: "", description: "", price: "", category_id: "" });
    setEditImageFile(null);
    setEditImagePreview(null);
  }

  async function handleSaveEdit(itemId: number) {
    if (!editForm.name.trim() || !editForm.description.trim()) {
      toast.error("Name and description are required.");
      return;
    }

    let nextImageUrl: string | undefined;

    if (editImageFile) {
      const filePath = `${Date.now()}-${editImageFile.name.replace(/\s+/g, "-")}`;
      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(filePath, editImageFile, { upsert: true });

      if (uploadError) {
        toast.error(uploadError.message);
        return;
      }

      const { data: publicUrlRes } = supabase.storage.from("menu-images").getPublicUrl(filePath);
      nextImageUrl = publicUrlRes.publicUrl;
    }

    const { error } = await supabase
      .from("menu_items")
      .update({
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.price),
        category_id: Number(editForm.category_id),
        ...(nextImageUrl ? { image_url: nextImageUrl } : {}),
      })
      .eq("id", itemId);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Menu item updated.");
    handleCancelEdit();
    loadData();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 motion-grid">
      <section className="space-y-4 rounded-2xl border border-kape-200 bg-white p-5 motion-card">
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

      <section className="space-y-4 rounded-2xl border border-kape-200 bg-white p-5 motion-card">
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
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Selected preview"
              className="h-44 w-full rounded-2xl border border-kape-200 object-cover"
            />
          )}
          <button className="rounded-xl bg-kulabo-500 px-4 py-2 text-sm font-semibold text-cream-50">
            Save Item
          </button>
        </form>
      </section>

      <section className="space-y-4 rounded-2xl border border-kape-200 bg-white p-5 motion-card lg:col-span-2">
        <h2 className="font-serif text-2xl font-semibold text-kape-900">Menu Items</h2>
        <div className="grid gap-3 md:grid-cols-2 motion-grid">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-kape-200 p-3 motion-card">
              <div className="flex gap-3">
                <img src={item.image_url} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-kape-900">{item.name}</p>
                  <p className="text-xs text-kape-700">{peso(item.price)}</p>
                </div>
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold text-kape-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {editingItemId === item.id && (
                <div className="mt-3 space-y-2 border-t border-kape-200 pt-3">
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))}
                    className="w-full rounded-xl border border-kape-300 px-3 py-2 text-sm"
                    placeholder="Item name"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm((s) => ({ ...s, description: e.target.value }))}
                    className="w-full rounded-xl border border-kape-300 px-3 py-2 text-sm"
                    placeholder="Description"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={editForm.price}
                      min={1}
                      onChange={(e) => setEditForm((s) => ({ ...s, price: e.target.value }))}
                      className="w-full rounded-xl border border-kape-300 px-3 py-2 text-sm"
                      placeholder="Price"
                    />
                    <select
                      value={editForm.category_id}
                      onChange={(e) =>
                        setEditForm((s) => ({ ...s, category_id: e.target.value }))
                      }
                      className="w-full rounded-xl border border-kape-300 px-3 py-2 text-sm"
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
                    onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                    type="file"
                    accept="image/*"
                    className="w-full rounded-xl border border-kape-300 px-3 py-2 text-sm"
                  />
                  {editImagePreview && (
                    <img
                      src={editImagePreview}
                      alt={`${item.name} preview`}
                      className="h-40 w-full rounded-2xl border border-kape-200 object-cover"
                    />
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="rounded-full bg-kulabo-500 px-4 py-2 text-xs font-semibold text-cream-50"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="rounded-full bg-cream-100 px-4 py-2 text-xs font-semibold text-kape-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
