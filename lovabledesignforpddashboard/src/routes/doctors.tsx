import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { doctors } from "@/lib/health-data";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "Doctors — YourHealthCo" },
      { name: "description", content: "Your consulting doctors and care team." },
      { property: "og:title", content: "Doctors — YourHealthCo" },
      { property: "og:description", content: "Your consulting doctors and care team." },
    ],
  }),
  component: DoctorsPage,
});

function DoctorsPage() {
  return (
    <DashboardLayout>
      <header className="animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_both]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-jade">Care team</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-balance">Consulting doctors</h1>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doc, i) => (
          <div
            key={doc.name}
            className="rounded-[22px] bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur-md animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_both]"
            style={{ animationDelay: `${120 + i * 80}ms` }}
          >
            <img
              src={doc.img}
              alt={doc.name}
              width={816}
              height={816}
              loading="lazy"
              className="size-20 rounded-2xl object-cover outline-1 -outline-offset-1 outline-black/5"
            />
            <h2 className="mt-4 text-lg font-extrabold tracking-tight">{doc.name}</h2>
            <p className="text-sm text-ink/50">{doc.role}</p>
            <span
              className={`mt-4 inline-block rounded-full px-2.5 py-1 font-mono text-[10px] ${
                doc.tag === "Primary" ? "bg-jade/15 text-jade" : "bg-white/70 text-ink/50"
              }`}
            >
              {doc.tag}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
