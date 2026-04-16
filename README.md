# Kamay Kainan

Modern, mobile-responsive Filipino restaurant web app built with Next.js App Router, Tailwind CSS, Supabase, and Vercel.

## Tech Stack

- Frontend: Next.js 16 (App Router, React 19, TypeScript)
- Styling: Tailwind CSS 4
- Backend: Supabase (Postgres, Auth, Realtime, Storage)
- State: Zustand (cart)
- Notifications: react-hot-toast
- Deployment: Vercel

## Features

- Home page with hero, featured dishes, and about preview
- Menu page with categories, search/filter, and add-to-cart
- Cart page with quantity controls and checkout
- Login/Register with Supabase email/password auth
- Persistent user session (SSR middleware + client auth)
- Admin dashboard (protected) for category/menu CRUD + image upload
- Realtime menu and order updates (Supabase Realtime)
- Contact page with Google Maps API embed and contact form UI
- Optional pages included: order history and profile
- Reusable components, warm Filipino-inspired palette, responsive layout

## Folder Structure

```text
.
|-- .env.example
|-- middleware.ts
|-- package.json
|-- src
|   |-- app
|   |   |-- admin/page.tsx
|   |   |-- cart/page.tsx
|   |   |-- contact/page.tsx
|   |   |-- login/page.tsx
|   |   |-- menu/page.tsx
|   |   |-- orders/page.tsx
|   |   |-- profile/page.tsx
|   |   |-- register/page.tsx
|   |   |-- favicon.ico
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   |-- page.tsx
|   |-- components
|   |   |-- sections
|   |   |   |-- about-preview.tsx
|   |   |   |-- featured-dishes.tsx
|   |   |   |-- hero.tsx
|   |   |-- ui/button.tsx
|   |   |-- admin-dashboard.tsx
|   |   |-- auth-modal.tsx
|   |   |-- cart-modal.tsx
|   |   |-- cart-view.tsx
|   |   |-- footer.tsx
|   |   |-- menu-grid.tsx
|   |   |-- navbar.tsx
|   |   |-- order-history.tsx
|   |   |-- profile-panel.tsx
|   |   |-- providers.tsx
|   |-- lib
|   |   |-- supabase
|   |   |   |-- client.ts
|   |   |   |-- middleware.ts
|   |   |   |-- server.ts
|   |   |-- auth.ts
|   |   |-- constants.ts
|   |   |-- data.ts
|   |   |-- utils.ts
|   |-- stores/cart-store.ts
|   |-- types/app.ts
|-- supabase/schema.sql
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Copy env template and fill values:

```bash
cp .env.example .env.local
```

Required env vars:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Also used for contact map:

- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

3. Create a Supabase project.

4. In Supabase SQL Editor, run [supabase/schema.sql](supabase/schema.sql).

5. Create an admin user role (replace with your real auth user UUID):

```sql
update public.users
set role = 'admin'
where id = '00000000-0000-0000-0000-000000000000';
```

6. Run local development server:

```bash
npm run dev
```

Open http://localhost:3000

## Supabase Notes

- Tables included:
  - users (id, email, role)
  - categories
  - menu_items
  - orders
  - order_items
- RLS enabled for all public tables
- Admin-only write policies for categories/menu
- User-scoped order policies
- Storage bucket: menu-images (public read, admin write)
- Trigger auto-creates public.users row from auth.users signup

## Realtime Coverage

- Menu page subscribes to menu_items changes
- Admin dashboard subscribes to menu_items and orders changes
- Orders page subscribes to order changes for logged-in users

## Vercel Deployment Guide

1. Push repo to GitHub.

2. In Vercel:
	- Import the repository
	- Framework preset: Next.js
	- Build command: npm run build
	- Output: .next (auto)

3. Add environment variables in Vercel Project Settings:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (optional but recommended for map)

4. Deploy.

5. After deployment:
	- Ensure Supabase Auth redirect URLs include your Vercel domain
	- Verify RLS policies by testing customer vs admin actions

## Available Scripts

- npm run dev
- npm run build
- npm run start
- npm run lint
