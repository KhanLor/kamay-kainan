"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { SITE } from "@/lib/constants";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    toast.success("Message sent. We will get back to you shortly.");
    setName("");
    setEmail("");
    setMessage("");
  }

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${mapsKey || ""}&q=${encodeURIComponent(SITE.address)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-4 rounded-2xl border border-kape-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Visit Us</p>
        <h1 className="font-serif text-4xl font-bold text-kape-900">Contact</h1>
        <p className="text-sm text-kape-700">Address: {SITE.address}</p>
        <p className="text-sm text-kape-700">Phone: {SITE.phone}</p>

        <iframe
          title="Kamay Kainan Map"
          src={mapUrl}
          className="h-72 w-full rounded-xl border border-kape-200"
          loading="lazy"
          allowFullScreen
        />
      </section>

      <section className="rounded-2xl border border-kape-200 bg-white p-6">
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
