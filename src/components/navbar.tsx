"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-kape-200/70 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="group rounded-xl px-1 py-0.5">
          <div className="flex items-end gap-2 leading-none sm:gap-2.5">
            <span className="text-3xl font-black text-yellow-500 sm:text-4xl">K</span>
            <span className="font-serif text-xl font-bold uppercase tracking-[0.08em] sm:text-2xl">
              <span className="text-emerald-500">AMAY </span>
              <span className="text-yellow-500">K</span>
              <span className="text-emerald-500">AINAN</span>
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-full px-4 py-1.5 font-serif text-xl font-semibold text-kape-700 transition hover:bg-cream-100 hover:text-kape-900",
                pathname === link.href && "bg-cream-100 text-kape-900",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-2 font-serif text-lg font-semibold text-kape-700",
                  pathname === link.href && "bg-cream-100 text-kape-900",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
