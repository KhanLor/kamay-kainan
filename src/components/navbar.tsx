"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User } from "lucide-react";
import { usePathname } from "next/navigation";

import { AuthModal } from "@/components/auth-modal";
import { CartModal } from "@/components/cart-modal";
import { SITE } from "@/lib/constants";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(Boolean(data.user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(Boolean(session?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleAuthAction() {
    if (!loggedIn) {
      setShowAuthModal(true);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setLoggedIn(false);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-kape-200/70 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="group">
          <p className="font-serif text-xl font-bold text-kape-900">{SITE.name}</p>
          <p className="text-xs uppercase tracking-[0.18em] text-kulabo-700 group-hover:text-kulabo-500">
            Filipino Kitchen
          </p>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium text-kape-700 transition hover:bg-cream-100 hover:text-kape-900",
                pathname === link.href && "bg-cream-100 text-kape-900",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            className="relative rounded-full bg-cream-100 p-2 text-kape-800 transition hover:bg-cream-200"
            onClick={() => setShowCartModal(true)}
          >
            <ShoppingBag className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-kulabo-500 px-1.5 text-[10px] font-bold text-cream-50">
                {totalItems}
              </span>
            )}
          </button>
          <Link
            href="/profile"
            className="rounded-full bg-cream-100 p-2 text-kape-800 transition hover:bg-cream-200"
          >
            <User className="h-4 w-4" />
          </Link>
          <button
            onClick={handleAuthAction}
            className="hidden rounded-full bg-kape-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-cream-50 sm:inline-flex"
          >
            {loggedIn ? "Logout" : "Login"}
          </button>
          <button
            className="rounded-full bg-cream-100 p-2 text-kape-800 md:hidden"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-kape-200 bg-cream-50 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAuthAction}
              className="rounded-xl bg-kape-900 px-3 py-2 text-left text-sm font-medium text-cream-50"
            >
              {loggedIn ? "Logout" : "Login"}
            </button>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium text-kape-700",
                  pathname === link.href && "bg-cream-100 text-kape-900",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <CartModal open={showCartModal} onClose={() => setShowCartModal(false)} />
    </header>
  );
}
