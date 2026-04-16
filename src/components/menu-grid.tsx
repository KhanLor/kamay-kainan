"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { CATEGORY_FALLBACK, MENU_FALLBACK } from "@/lib/constants";
import { Category, MenuItem } from "@/types/app";
import { peso } from "@/lib/utils";

type JoinedMenuItem = Omit<MenuItem, "category"> & { categories?: Category[] };

export function MenuGrid() {
  const [items, setItems] = useState<MenuItem[]>(MENU_FALLBACK);
  const [categories, setCategories] = useState<Category[]>(CATEGORY_FALLBACK);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [search, setSearch] = useState("");

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
    <div className="space-y-5 motion-stack">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kape-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes"
            className="w-full rounded-full border border-kape-300 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-full px-4 py-1.5 text-sm ${
              selectedCategory === "all"
                ? "bg-kape-900 text-cream-50"
                : "border border-kape-300 bg-white text-kape-800"
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
                  : "border border-kape-300 bg-white text-kape-800"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 motion-grid">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="group overflow-hidden rounded-3xl border border-kape-200/70 bg-white shadow-sm motion-card transition duration-500 hover:shadow-xl"
          >
            <div className="relative">
              <img src={item.image_url} alt={item.name} className="h-48 w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-kape-700">
                {item.category?.name || "House Specialty"}
              </span>
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-xl font-semibold text-kape-900">{item.name}</h3>
                <p className="text-sm font-bold text-kulabo-600">{peso(item.price)}</p>
              </div>
              <p className="text-sm text-kape-700">{item.description}</p>
              <div className="rounded-xl border border-kape-200 bg-cream-50 px-3 py-2 text-xs text-kape-700">
                Freshly prepared daily. Ask our staff for chef recommendations.
              </div>
            </div>
          </article>
        ))}
      </div>

      {!filtered.length && (
        <div className="rounded-2xl border border-dashed border-kape-300 bg-white p-8 text-center text-sm text-kape-700">
          No dishes found for your current filters. Try another category or search keyword.
        </div>
      )}
    </div>
  );
}
