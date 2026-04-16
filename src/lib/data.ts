import { CATEGORY_FALLBACK, MENU_FALLBACK } from "@/lib/constants";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Category, MenuItem } from "@/types/app";

type JoinedMenuItem = Omit<MenuItem, "category"> & { categories?: Category[] };

export async function getMenuData() {
  try {
    const supabase = await getSupabaseServerClient();

    const [menuRes, categoriesRes] = await Promise.all([
      supabase
        .from("menu_items")
        .select("id, name, description, price, image_url, category_id, categories(id, name)")
        .order("id", { ascending: true }),
      supabase.from("categories").select("id, name").order("name", { ascending: true }),
    ]);

    const items =
      !menuRes.error && menuRes.data?.length
        ? (menuRes.data as JoinedMenuItem[]).map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image_url: item.image_url,
            category_id: item.category_id,
            category: Array.isArray(item.categories)
              ? item.categories[0]
              : undefined,
          }))
        : MENU_FALLBACK;

    const categories =
      !categoriesRes.error && categoriesRes.data?.length
        ? (categoriesRes.data as Category[])
        : CATEGORY_FALLBACK;

    return { items, categories };
  } catch {
    return { items: MENU_FALLBACK, categories: CATEGORY_FALLBACK };
  }
}
