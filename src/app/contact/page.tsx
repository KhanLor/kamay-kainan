"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { SITE } from "@/lib/constants";

const storeHours = [
  { day: "Sunday", hours: "OPEN" },
  { day: "Monday", hours: "10:00 AM - 10:00 PM" },
  { day: "Tuesday", hours: "10:00 AM - 10:00 PM" },
  { day: "Wednesday", hours: "10:00 AM - 10:00 PM" },
  { day: "Thursday", hours: "10:00 AM - 10:00 PM" },
  { day: "Friday", hours: "10:00 AM - 10:00 PM" },
  { day: "Saturday", hours: "10:00 AM - 10:00 PM" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showLocationDetails, setShowLocationDetails] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    toast.success("Message sent. We will get back to you shortly.");
    setName("");
    setEmail("");
    setMessage("");
  }

  const encodedAddress = encodeURIComponent(SITE.address);
  const mapUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
  const mapExternalUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <div className="space-y-6 motion-stack">
      <section className="rounded-3xl border border-kape-200 bg-white p-6 shadow-sm motion-card sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Visit Us</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-kape-900">Contact</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-kape-700 sm:text-base">
          We’d love to hear from you. Visit our restaurant, call us, or send us an email for reservations, inquiries,
          and service requests.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3 motion-grid">
        <article className="rounded-2xl border border-kape-200 bg-white p-5 shadow-sm motion-card">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-kulabo-700">Visit Us</p>
          <p className="mt-2 text-sm leading-7 text-kape-700">{SITE.address}</p>
        </article>

        <article className="rounded-2xl border border-kape-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-kulabo-700">Call Us</p>
          <a href={`tel:${SITE.phone}`} className="mt-2 block text-sm font-semibold text-kape-900 underline-offset-4 hover:underline">
            {SITE.phone}
          </a>
        </article>

        <article className="rounded-2xl border border-kape-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-kulabo-700">Email Us</p>
          <a
            href="mailto:info@kamaykainan.com"
            className="mt-2 block text-sm font-semibold text-kape-900 underline-offset-4 hover:underline"
          >
            info@kamaykainan.com
          </a>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 motion-grid">
        <section
          role="button"
          tabIndex={0}
          onClick={() => setShowLocationDetails((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setShowLocationDetails((current) => !current);
            }
          }}
          className="cursor-pointer space-y-4 rounded-2xl border border-kape-200 bg-white p-6 shadow-sm motion-card outline-none transition hover:shadow-md focus:ring-2 focus:ring-kulabo-500"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Location</p>
          <p className="text-sm text-kape-700">Address: {SITE.address}</p>
          <p className="text-xs font-medium text-kape-500">Click the map to know where this place is</p>

        <iframe
          title="Kamay Kainan Map"
          src={mapUrl}
          className="pointer-events-none h-72 w-full rounded-xl border border-kape-200"
          loading="lazy"
          allowFullScreen
        />

        {showLocationDetails && (
          <div className="rounded-2xl border border-kape-200 bg-cream-50 p-4 text-sm leading-7 text-kape-700">
            <p className="font-semibold text-kape-900">Kamay Kainan</p>
            <p>{SITE.address}</p>
            <p className="mt-2">
              We are located in Quezon City, Metro Manila, near the main city roads for easy access by car or public
              transportation.
            </p>
            <p className="mt-2">
              For directions, click Open in Google Maps to view the exact route and nearby landmarks.
            </p>
          </div>
        )}

        <a
          href={mapExternalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-semibold text-kulabo-700 underline underline-offset-4"
        >
          Open in Google Maps
        </a>
        </section>

        <section className="rounded-2xl border border-kape-200 bg-white p-6 shadow-sm motion-card">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Store Hours</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-kape-900">Hours of Operation</h2>

          <div className="mt-4 overflow-hidden rounded-2xl border border-kape-200">
            {storeHours.map((item, index) => (
              <div
                key={item.day}
                className={`flex items-center justify-between px-4 py-3 text-sm ${
                  index % 2 === 0 ? "bg-cream-50" : "bg-white"
                }`}
              >
                <span className="font-medium text-kape-800">{item.day}</span>
                <span className="text-kape-700">{item.hours}</span>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="rounded-2xl border border-kape-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl font-semibold text-kape-900">Send Us a Message</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-kape-300 px-3 py-2"
            placeholder="Name"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-kape-300 px-3 py-2"
            placeholder="Email"
            required
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-32 w-full rounded-xl border border-kape-300 px-3 py-2"
            placeholder="Message"
            required
          />
          <button className="rounded-full bg-kulabo-500 px-5 py-2.5 text-sm font-semibold text-cream-50">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}
