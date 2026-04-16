import Link from "next/link";

const openings = [
  {
    role: "Line Cook",
    type: "Full-time",
    location: "Quezon City",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    role: "Dining Service Lead",
    type: "Full-time",
    location: "Quezon City",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=80",
  },
  {
    role: "Cashier",
    type: "Full-time",
    location: "Quezon City",
    image:
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1400&q=80",
  },
];

const requirements = [
  "Updated Resume / CV",
  "Barangay Certificate (local clearance)",
  "Police Clearance",
  "NBI Clearance",
  "Government-issued valid IDs",
  "Medical / Clinic Certificate (fit to work)",
];

function getApplyPageLink(role: string) {
  return `/careers/apply?role=${encodeURIComponent(role)}`;
}

export default function CareersPage() {
  return (
    <div className="space-y-7 motion-stack">
      <section className="relative overflow-hidden rounded-3xl border border-kape-200 bg-white p-6 shadow-sm motion-card sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-kulabo-300/20 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Join The Team</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-kape-900">Careers</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-kape-700 sm:text-base">
          We are building a team passionate about Filipino cuisine, warm guest experiences, and meaningful growth.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 motion-grid">
        {openings.map((opening) => (
          <article
            key={opening.role}
            className="group relative overflow-hidden rounded-3xl border border-kape-200 bg-white shadow-sm motion-card transition duration-500 hover:shadow-xl"
          >
            <img
              src={opening.image}
              alt={opening.role}
              className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h2 className="font-serif text-3xl font-semibold">{opening.role}</h2>
              <p className="mt-1 text-sm font-medium text-white/90">
                {opening.type} • {opening.location}
              </p>

              <Link
                href={getApplyPageLink(opening.role)}
                className="mt-4 inline-flex rounded-full bg-kulabo-500 px-4 py-2 text-sm font-semibold text-cream-50 transition hover:bg-kulabo-600"
              >
                Apply Now
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-kape-200 bg-white p-6 shadow-sm motion-card sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Pre-employment</p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-kape-900">Requirements</h2>
        <p className="mt-2 text-sm leading-7 text-kape-700 sm:text-base">
          Please prepare the following documents before final interview and onboarding.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 motion-grid">
          {requirements.map((item) => (
            <article key={item} className="rounded-2xl border border-kape-200 bg-cream-50 p-4 motion-card">
              <p className="text-sm font-medium text-kape-800">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-kape-200 bg-white p-6 shadow-sm motion-card sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">Application Guide</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-kape-900">How To Apply</h2>

            <ol className="mt-4 space-y-3 text-sm leading-7 text-kape-700 sm:text-base">
              <li>
                1. Choose a position and click Apply Now.
              </li>
              <li>
                2. Send your resume to careers@kamaykainan.com with your preferred role as the subject.
              </li>
              <li>
                3. Include your full name, contact number, and relevant work experience.
              </li>
              <li>
                4. Attach your required clearances and medical / clinic certificate.
              </li>
              <li>
                5. Our hiring team will contact shortlisted applicants for interview scheduling.
              </li>
            </ol>
          </div>

          <aside className="rounded-2xl border border-kape-200 bg-cream-50 p-5">
            <h3 className="font-serif text-2xl font-semibold text-kape-900">Other Position?</h3>
            <p className="mt-2 text-sm leading-7 text-kape-700">
              If your desired role is not listed, you can still apply and tell us the position you want.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={getApplyPageLink("Other Position")}
                className="inline-flex rounded-full bg-kulabo-500 px-4 py-2 text-sm font-semibold text-cream-50 transition hover:bg-kulabo-600"
              >
                Apply For Other Position
              </Link>
              <Link
                href={getApplyPageLink("Careers Inquiry")}
                className="inline-flex rounded-full border border-kape-300 bg-white px-4 py-2 text-sm font-semibold text-kape-800 transition hover:border-kape-500"
              >
                Contact HR
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
