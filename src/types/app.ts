export type Category = {
  id: number;
  name: string;
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  category?: Category;
};

export type Order = {
  id: number;
  user_id: string;
  total: number;
  status: "pending" | "preparing" | "completed" | "cancelled";
  created_at: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  menu_item?: MenuItem;
};

export type CartLine = {
  item: MenuItem;
  quantity: number;
};
