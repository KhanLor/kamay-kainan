import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { SITE } from "@/lib/constants";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13.5 22v-8.2h2.76l.42-3.2h-3.18V8.56c0-.93.26-1.57 1.6-1.57h1.7V4.12c-.3-.04-1.32-.12-2.5-.12-2.46 0-4.14 1.5-4.14 4.25V10.6H7.4v3.2h2.76V22H13.5z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.69c-2.78.61-3.37-1.17-3.37-1.17-.46-1.17-1.12-1.49-1.12-1.49-.92-.63.07-.62.07-.62 1.02.07 1.56 1.05 1.56 1.05.9 1.55 2.38 1.1 2.96.84.09-.65.35-1.1.63-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.11-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.21 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.35 4.69-4.58 4.94.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-kape-200 bg-kape-900 text-cream-100">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <Link href="/" className="inline-flex items-end gap-1.5">
            <span className="text-3xl font-black text-yellow-400">K</span>
            <span className="font-serif text-lg font-bold uppercase tracking-[0.08em] text-cream-100">
              AMAY KAINAN
            </span>
          </Link>
          <p className="mt-2 text-sm text-cream-200">{SITE.description}</p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-cream-300">About Us</p>
          <p className="mt-1 text-sm text-cream-200">
            A Filipino restaurant serving warm, home-style meals with modern hospitality.
          </p>
        </div>

        <div className="space-y-2 text-sm text-cream-200">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> {SITE.address}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> {SITE.phone}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> {SITE.email}
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-cream-300">
            Follow us
          </p>
          <div className="flex items-center gap-3">
            <Link href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="rounded-full bg-kape-800 p-2 hover:bg-kape-700">
              <FacebookIcon className="h-4 w-4" />
            </Link>
            <Link href={SITE.github} target="_blank" rel="noopener noreferrer" className="rounded-full bg-kape-800 p-2 hover:bg-kape-700">
              <GitHubIcon className="h-4 w-4" />
            </Link>
            <Link href={`mailto:${SITE.email}`} className="rounded-full bg-kape-800 p-2 hover:bg-kape-700">
              <Mail className="h-4 w-4" />
            </Link>
          </div>
          <Link
            href="/login"
            className="mt-4 inline-block text-sm font-semibold text-cream-100 underline underline-offset-4"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
