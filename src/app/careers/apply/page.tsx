import Link from "next/link";

function getGmailApplyLink(role: string) {
  const subject = encodeURIComponent(`Application - ${role}`);
  const body = encodeURIComponent(
    `Hi Kamay Kainan Team,\n\nI would like to apply for the position of ${role}.\n\nName:\nContact Number:\nRelevant Experience:\nAttached Requirements:\n\nThank you.`,
  );

  return `https://mail.google.com/mail/?view=cm&fs=1&to=careers@kamaykainan.com&su=${subject}&body=${body}`;
}

export default function CareersApplyPage({
  searchParams,
}: {
  searchParams?: { role?: string };
}) {
  const role = searchParams?.role || "Position";

  return (
    <div className="mx-auto max-w-3xl space-y-6 motion-stack">
      <section className="rounded-3xl border border-kape-200 bg-white p-6 shadow-sm motion-card sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Application</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-kape-900">Apply for {role}</h1>
        <p className="mt-3 text-sm leading-7 text-kape-700 sm:text-base">
          You are now on the application page. Click Continue to Gmail to send your application.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={getGmailApplyLink(role)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-kulabo-500 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-kulabo-600"
          >
            Continue to Gmail
          </a>
          <Link
            href="/careers"
            className="inline-flex rounded-full border border-kape-300 bg-white px-5 py-2.5 text-sm font-semibold text-kape-800 transition hover:border-kape-500"
          >
            Back to Careers
          </Link>
        </div>
      </section>
    </div>
  );
}
