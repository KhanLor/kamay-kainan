import Link from "next/link";
import { Phone, MapPin, Globe, MessageCircle } from "lucide-react";

import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-kape-200 bg-kape-900 text-cream-100">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-xl font-semibold">{SITE.name}</h3>
          <p className="mt-2 text-sm text-cream-200">{SITE.description}</p>
        </div>

        <div className="space-y-2 text-sm text-cream-200">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> {SITE.address}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> {SITE.phone}
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-cream-300">
            Follow us
          </p>
          <div className="flex items-center gap-3">
            <Link href="#" className="rounded-full bg-kape-800 p-2 hover:bg-kape-700">
              <Globe className="h-4 w-4" />
            </Link>
            <Link href="#" className="rounded-full bg-kape-800 p-2 hover:bg-kape-700">
              <MessageCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
