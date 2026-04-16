import Link from "next/link";
import { BriefcaseBusiness, Building2, CalendarHeart, ChefHat, Sparkles, UtensilsCrossed } from "lucide-react";

const featuredService = {
  title: "Signature Dining Experience",
  description:
    "A warm in-house culinary journey featuring elevated Filipino classics, chef-recommended pairings, and attentive table service.",
};

function getInquiryPageLink(serviceName: string) {
  return `/services/inquire?service=${encodeURIComponent(serviceName)}`;
}

const services = [
  {
    title: "Private Catering",
    description: "Bespoke catering for birthdays, corporate events, and intimate celebrations.",
    icon: CalendarHeart,
  },
  {
    title: "Corporate Lunch Packages",
    description: "Daily and weekly meal plans designed for offices and teams.",
    icon: Building2,
  },
  {
    title: "Party Trays",
    description: "Large-format platters of crowd-favorite dishes for family gatherings.",
    icon: UtensilsCrossed,
  },
  {
    title: "Event Venue Setup",
    description: "Restaurant space styling and setup support for private bookings.",
    icon: Sparkles,
  },
  {
    title: "Custom Menu Planning",
    description: "Personalized menus based on dietary preferences and event themes.",
    icon: ChefHat,
  },
  {
    title: "Business Dining Programs",
    description: "Flexible service plans for recurring team meals and client hosting.",
    icon: BriefcaseBusiness,
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-7 motion-stack">
      <section className="relative overflow-hidden rounded-3xl border border-kape-200 bg-white p-6 shadow-sm motion-card sm:p-9">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-kulabo-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-10 h-48 w-48 rounded-full bg-kulabo-500/10 blur-3xl" />

        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">What We Offer</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-kape-900">Services</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-kape-700 sm:text-base">
          Beyond daily dining, Kamay Kainan offers full-service hospitality for events, teams, and custom experiences.
        </p>

        <article className="relative mt-6 rounded-2xl border border-kape-200 bg-[linear-gradient(135deg,#ffffff_0%,#f4faf4_100%)] p-5 motion-card sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-kulabo-700">Featured Service</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-kape-900">{featuredService.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-kape-700 sm:text-base">{featuredService.description}</p>
          <Link
            href={getInquiryPageLink(featuredService.title)}
            className="mt-4 inline-flex rounded-full bg-kulabo-500 px-4 py-2 text-sm font-semibold text-cream-50 transition hover:bg-kulabo-600"
          >
            Inquire Now
          </Link>
        </article>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 motion-grid">
        {services.map((service) => (
          <article
            key={service.title}
            className="group rounded-2xl border border-kape-200 bg-white p-5 shadow-sm motion-card transition duration-300 hover:shadow-lg"
          >
            <div className="inline-flex rounded-xl bg-cream-100 p-2.5 text-kulabo-600">
              <service.icon className="h-5 w-5" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-kape-900">{service.title}</h2>
            <p className="mt-2 text-sm leading-7 text-kape-700">{service.description}</p>
            <Link
              href={getInquiryPageLink(service.title)}
              className="mt-4 inline-flex rounded-full border border-kulabo-500 px-4 py-2 text-sm font-semibold text-kulabo-600 transition hover:bg-cream-100"
            >
              Inquire
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
