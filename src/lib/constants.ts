import { Category, MenuItem } from "@/types/app";

export const CATEGORY_FALLBACK: Category[] = [
  { id: 1, name: "Rice Meals" },
  { id: 2, name: "Seafood" },
  { id: 3, name: "Drinks" },
];

export const MENU_FALLBACK: MenuItem[] = [
  {
    id: 101,
    name: "Crispy Pata Feast",
    description: "Slow-braised pork leg, deep-fried until crackling crisp.",
    price: 780,
    image_url:
      "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=1200&q=80",
    category_id: 1,
  },
  {
    id: 102,
    name: "Garlic Butter Sugpo",
    description: "Jumbo prawns tossed in toasted garlic and calamansi butter.",
    price: 680,
    image_url:
      "https://images.unsplash.com/photo-1598514982841-6bf1f0f7f5ea?auto=format&fit=crop&w=1200&q=80",
    category_id: 2,
  },
  {
    id: 103,
    name: "Sinigang na Salmon",
    description: "Tamarind broth with salmon belly, kangkong, and radish.",
    price: 520,
    image_url:
      "https://images.unsplash.com/photo-1625944525903-fb916f995d58?auto=format&fit=crop&w=1200&q=80",
    category_id: 2,
  },
  {
    id: 104,
    name: "Halo-Halo Cooler",
    description: "Shaved ice dessert drink with leche flan and ube cream.",
    price: 190,
    image_url:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=1200&q=80",
    category_id: 3,
  },
  {
    id: 105,
    name: "Chicken Inasal Plate",
    description: "Grilled annatto-marinated chicken with garlic rice.",
    price: 320,
    image_url:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80",
    category_id: 1,
  },
  {
    id: 106,
    name: "Calamansi Soda",
    description: "Fresh calamansi, sparkling water, and muscovado syrup.",
    price: 130,
    image_url:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1200&q=80",
    category_id: 3,
  },
];

export const SITE = {
  name: "Kamay Kainan",
  slogan: "Lutong Bahay, Handang-Handa",
  description:
    "Kamay Kainan brings elevated Filipino comfort food to your table with warm hospitality and bold local flavors.",
  address: "42 Magsaysay Ave, Quezon City, Metro Manila",
  phone: "+63 917 123 4567",
  email: "info@kamaykainan.com",
  facebook: "https://www.facebook.com/biglaanmeals?locale=tl_PH",
  github: "https://github.com/KhanLor",
};
