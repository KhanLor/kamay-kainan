import Link from "next/link";

export function AboutPreview() {
  return (
    <section className="grid gap-6 rounded-3xl border border-kape-200 bg-white p-6 sm:grid-cols-2 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">About Us</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-kape-900">
          Built on family recipes and warm service
        </h2>
      </div>
      <div className="space-y-3 text-sm text-kape-700 sm:text-base">
        <p>
          Kamay Kainan celebrates Filipino classics with a modern touch, from sizzling comfort dishes to refreshing tropical drinks.
        </p>
        <p>
          Every plate is prepared fresh, inspired by local ingredients and the joy of sharing meals together.
        </p>
        <Link href="/contact" className="inline-block text-sm font-semibold text-kulabo-700 underline underline-offset-4">
          Visit us in Quezon City
        </Link>
      </div>
    </section>
  );
}
