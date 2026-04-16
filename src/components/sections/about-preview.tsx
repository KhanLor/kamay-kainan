import Link from "next/link";

export function AboutPreview() {
  return (
    <section className="grid gap-6 rounded-3xl border border-kape-200 bg-white p-6 motion-card sm:grid-cols-2 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">About Us</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-kape-900">Fresh Filipino meals, made with care</h2>
      </div>
      <div className="space-y-3 text-sm text-kape-700 sm:text-base">
        <p>
          Kamay Kainan serves comforting Filipino dishes inspired by home-style cooking, local flavors, and warm hospitality.
        </p>
        <p>
          Every meal is prepared fresh and shared with the spirit of togetherness, from everyday dining to special occasions.
        </p>
        <Link href="/contact" className="inline-block text-sm font-semibold text-kulabo-700 underline underline-offset-4">
          Visit us in Quezon City
        </Link>
      </div>
    </section>
  );
}
