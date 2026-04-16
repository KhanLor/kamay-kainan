"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { CATEGORY_FALLBACK, MENU_FALLBACK } from "@/lib/constants";
import { Category, MenuItem } from "@/types/app";
import { peso } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

type JoinedMenuItem = Omit<MenuItem, "category"> & { categories?: Category[] };

export function MenuGrid() {
  const [items, setItems] = useState<MenuItem[]>(MENU_FALLBACK);
  const [categories, setCategories] = useState<Category[]>(CATEGORY_FALLBACK);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function loadData() {
      const [itemsRes, categoriesRes] = await Promise.all([
        supabase
          .from("menu_items")
          .select("id, name, description, price, image_url, category_id, categories(id, name)")
          .order("id", { ascending: true }),
        supabase.from("categories").select("id, name").order("name", { ascending: true }),
      ]);

      if (!itemsRes.error && itemsRes.data?.length) {
        setItems(
          (itemsRes.data as JoinedMenuItem[]).map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image_url: item.image_url,
            category_id: item.category_id,
            category: Array.isArray(item.categories)
              ? item.categories[0]
              : undefined,
          })),
        );
      }

      if (!categoriesRes.error && categoriesRes.data?.length) {
        setCategories(categoriesRes.data as Category[]);
      }
    }

    loadData();

    const menuChannel = supabase
      .channel("public:menu_items")
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, loadData)
      .subscribe();

    return () => {
      supabase.removeChannel(menuChannel);
    };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category_id === selectedCategory;
      const text = `${item.name} ${item.description}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kape-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes"
            className="w-full rounded-full border border-kape-300 bg-white py-2 pl-10 pr-4 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-full px-4 py-1.5 text-sm ${
              selectedCategory === "all"
                ? "bg-kape-900 text-cream-50"
                : "bg-cream-100 text-kape-800"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`rounded-full px-4 py-1.5 text-sm ${
                selectedCategory === category.id
                  ? "bg-kape-900 text-cream-50"
                  : "bg-cream-100 text-kape-800"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl border border-kape-200 bg-white shadow-sm">
            <img src={item.image_url} alt={item.name} className="h-44 w-full object-cover" />
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-xl font-semibold text-kape-900">{item.name}</h3>
                <p className="text-sm font-bold text-kulabo-600">{peso(item.price)}</p>
              </div>
              <p className="text-sm text-kape-700">{item.description}</p>
              <button
                onClick={() => {
                  addItem(item);
                  toast.success(`${item.name} added to cart`);
                }}
                className="w-full rounded-full bg-kulabo-500 px-4 py-2 text-sm font-semibold text-cream-50 transition hover:bg-kulabo-600"
              >
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
