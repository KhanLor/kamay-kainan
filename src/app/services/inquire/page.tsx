import Link from "next/link";

function getGmailInquiryLink(service: string) {
  const subject = encodeURIComponent(`Service Inquiry - ${service}`);
  const body = encodeURIComponent(
    `Hi Kamay Kainan Team,\n\nI would like to inquire about this service: ${service}\n\nPreferred Date:\nGuest/Headcount:\nAdditional Notes:\n`,
  );

  return `https://mail.google.com/mail/?view=cm&fs=1&to=inquiries@kamaykainan.com&su=${subject}&body=${body}`;
}

export default function ServicesInquirePage({
  searchParams,
}: {
  searchParams?: { service?: string };
}) {
  const service = searchParams?.service || "Service";

  return (
    <div className="mx-auto max-w-3xl space-y-6 motion-stack">
      <section className="rounded-3xl border border-kape-200 bg-white p-6 shadow-sm motion-card sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Inquiry</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-kape-900">Inquire: {service}</h1>
        <p className="mt-3 text-sm leading-7 text-kape-700 sm:text-base">
          You are now on the inquiry page. Click Continue to Gmail to send your inquiry details.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={getGmailInquiryLink(service)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-kulabo-500 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-kulabo-600"
          >
            Continue to Gmail
          </a>
          <Link
            href="/services"
            className="inline-flex rounded-full border border-kape-300 bg-white px-5 py-2.5 text-sm font-semibold text-kape-800 transition hover:border-kape-500"
          >
            Back to Services
          </Link>
        </div>
      </section>
    </div>
  );
}
