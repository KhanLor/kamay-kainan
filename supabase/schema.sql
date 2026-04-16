-- Kamay Kainan Supabase schema and security

create extension if not exists "pgcrypto";

drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.users cascade;
drop function if exists public.handle_new_user() cascade;

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

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('admin@kamaykainan.com');
$$;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;

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

insert into public.categories (name)
values ('Rice Meals'), ('Seafood'), ('Drinks')
on conflict (name) do nothing;

insert into public.menu_items (id, name, description, price, image_url, category_id)
overriding system value
select
  v.id,
  v.name,
  v.description,
  v.price,
  v.image_url,
  c.id
from (
  values
    (
      101,
      'Crispy Pata Feast',
      'Slow-braised pork leg, deep-fried until crackling crisp.',
      780,
      'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=1200&q=80',
      'Rice Meals'
    ),
    (
      102,
      'Garlic Butter Sugpo',
      'Jumbo prawns tossed in toasted garlic and calamansi butter.',
      680,
      'https://images.unsplash.com/photo-1598514982841-6bf1f0f7f5ea?auto=format&fit=crop&w=1200&q=80',
      'Seafood'
    ),
    (
      103,
      'Sinigang na Salmon',
      'Tamarind broth with salmon belly, kangkong, and radish.',
      520,
      'https://images.unsplash.com/photo-1625944525903-fb916f995d58?auto=format&fit=crop&w=1200&q=80',
      'Seafood'
    ),
    (
      104,
      'Halo-Halo Cooler',
      'Shaved ice dessert drink with leche flan and ube cream.',
      190,
      'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=1200&q=80',
      'Drinks'
    ),
    (
      105,
      'Chicken Inasal Plate',
      'Grilled annatto-marinated chicken with garlic rice.',
      320,
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80',
      'Rice Meals'
    ),
    (
      106,
      'Calamansi Soda',
      'Fresh calamansi, sparkling water, and muscovado syrup.',
      130,
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1200&q=80',
      'Drinks'
    )
) as v(id, name, description, price, image_url, category_name)
join public.categories c
  on c.name = v.category_name
where not exists (
  select 1
  from public.menu_items mi
  where mi.id = v.id or mi.name = v.name
);

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
