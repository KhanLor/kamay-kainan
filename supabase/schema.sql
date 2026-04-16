-- Kamay Kainan Supabase schema and security

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id bigint generated always as identity primary key,
  name text not null,
  description text not null,
  price numeric(10,2) not null check (price > 0),
  image_url text not null,
  category_id bigint not null references public.categories(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  total numeric(10,2) not null check (total >= 0),
  status text not null default 'pending' check (status in ('pending', 'preparing', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  menu_item_id bigint not null references public.menu_items(id) on delete restrict,
  quantity integer not null check (quantity > 0)
);

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.users where id = uid and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, 'customer')
  on conflict (id) do update set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- users policies
drop policy if exists "users_select_self_or_admin" on public.users;
create policy "users_select_self_or_admin"
on public.users
for select
using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "users_update_self_or_admin" on public.users;
create policy "users_update_self_or_admin"
on public.users
for update
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "users_insert_self_or_admin" on public.users;
create policy "users_insert_self_or_admin"
on public.users
for insert
with check (auth.uid() = id or public.is_admin(auth.uid()));

-- categories policies
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
on public.categories
for select
using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write"
on public.categories
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- menu_items policies
drop policy if exists "menu_public_read" on public.menu_items;
create policy "menu_public_read"
on public.menu_items
for select
using (true);

drop policy if exists "menu_admin_write" on public.menu_items;
create policy "menu_admin_write"
on public.menu_items
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- orders policies
drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin"
on public.orders
for select
using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own"
on public.orders
for insert
with check (auth.uid() = user_id);

drop policy if exists "orders_update_admin_only" on public.orders;
create policy "orders_update_admin_only"
on public.orders
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- order_items policies
drop policy if exists "order_items_select_own_or_admin" on public.order_items;
create policy "order_items_select_own_or_admin"
on public.order_items
for select
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_id and (o.user_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

drop policy if exists "order_items_insert_own" on public.order_items;
create policy "order_items_insert_own"
on public.order_items
for insert
with check (
  exists (
    select 1
    from public.orders o
    where o.id = order_id and o.user_id = auth.uid()
  )
);

drop policy if exists "order_items_admin_update_delete" on public.order_items;
create policy "order_items_admin_update_delete"
on public.order_items
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

insert into public.categories (name)
values ('Rice Meals'), ('Seafood'), ('Drinks')
on conflict (name) do nothing;

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

drop policy if exists "menu_images_public_read" on storage.objects;
create policy "menu_images_public_read"
on storage.objects
for select
using (bucket_id = 'menu-images');

drop policy if exists "menu_images_admin_insert" on storage.objects;
create policy "menu_images_admin_insert"
on storage.objects
for insert
with check (bucket_id = 'menu-images' and public.is_admin(auth.uid()));

drop policy if exists "menu_images_admin_update" on storage.objects;
create policy "menu_images_admin_update"
on storage.objects
for update
using (bucket_id = 'menu-images' and public.is_admin(auth.uid()))
with check (bucket_id = 'menu-images' and public.is_admin(auth.uid()));

drop policy if exists "menu_images_admin_delete" on storage.objects;
create policy "menu_images_admin_delete"
on storage.objects
for delete
using (bucket_id = 'menu-images' and public.is_admin(auth.uid()));
