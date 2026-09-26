import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { doctors, mealsWeek, medsWeek, nextAppointment, weekDays } from "@/lib/health-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — YourHealthCo" },
      { name: "description", content: "Your wellness snapshot: meals, medications, next appointment, and your care team." },
      { property: "og:title", content: "Dashboard — YourHealthCo" },
      { property: "og:description", content: "Your wellness snapshot: meals, medications, next appointment, and your care team." },
    ],
  }),
  component: DashboardPage,
});

function Dot({ done }: { done: boolean }) {
  return done ? (
    <span className="size-2 rounded-full bg-jade" />
  ) : (
    <span className="size-2 rounded-full border border-ink/30" />
  );
}

function DashboardPage() {
  return (
    <DashboardLayout>
      <header className="flex items-end justify-between animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_both] [animation-delay:80ms]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-jade">Tuesday · 14 May</p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-balance">Good morning, Amara</h1>
        </div>
        <p className="hidden font-mono text-[11px] text-ink/40 sm:block">Week 20 · 4 of 7 done</p>
      </header>

      <div className="mt-6 grid grid-cols-12 gap-5">
        {/* MEALS */}
        <section className="col-span-12 animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_both] [animation-delay:160ms] lg:col-span-7">
          <Link
            to="/meals"
            className="group block h-full overflow-hidden rounded-[22px] bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur-md transition-colors hover:bg-white/85"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-jade">Section A</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Meals</h2>
              </div>
              <span className="grid size-9 place-items-center rounded-full bg-deep text-white transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="size-4" />
              </span>
            </div>
            <p className="mt-1 text-sm text-ink/60">Weekly nutrition plan</p>
            <div className="mt-5 grid grid-cols-7 gap-2">
              {weekDays.map((day, i) => {
                const active = i < 2;
                return (
                  <div
                    key={day}
                    className={`rounded-lg py-2 text-center ${active ? "bg-jade/15" : "bg-white/60"}`}
                  >
                    <p className={`font-mono text-[10px] ${active ? "text-jade" : "text-ink/40"}`}>{day[0]}</p>
                    <p className={`mt-1 text-[11px] font-semibold ${active ? "" : "text-ink/40"}`}>
                      {mealsWeek[day].length}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 space-y-2">
              {mealsWeek.Tue.slice(0, 3).map((m) => (
                <div key={m.label} className="flex items-center justify-between rounded-xl bg-white/70 px-3.5 py-2.5">
                  <span className={`text-sm font-medium ${m.done ? "" : "text-ink/50"}`}>
                    {m.label} · {m.time}
                  </span>
                  <Dot done={m.done} />
                </div>
              ))}
            </div>
            <p className="mt-5 font-mono text-[11px] text-ink/50">Tap for full weekly timetable →</p>
          </Link>
        </section>

        {/* APPOINTMENT */}
        <section className="col-span-12 animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_both] [animation-delay:220ms] lg:col-span-5">
          <div className="flex h-full flex-col rounded-[22px] bg-deep p-6 text-white ring-1 ring-black/5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-jade">Next up</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Appointment</h2>
              </div>
              <span className="rounded-full bg-jade px-2.5 py-1 font-mono text-[10px] font-medium text-deep">
                {nextAppointment.countdown}
              </span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <img
                src={nextAppointment.doctor.img}
                alt={nextAppointment.doctor.name}
                width={816}
                height={816}
                loading="lazy"
                className="size-12 shrink-0 rounded-full object-cover outline-1 -outline-offset-1 outline-white/10"
              />
              <div>
                <p className="text-sm font-semibold">{nextAppointment.doctor.name}</p>
                <p className="text-[12px] text-white/50">{nextAppointment.doctor.role}</p>
              </div>
            </div>
            <div className="mt-5 space-y-2.5 border-t border-white/10 pt-5 font-mono text-[12px] text-white/70">
              <div className="flex justify-between">
                <span>{nextAppointment.date}</span>
                <span>{nextAppointment.time}</span>
              </div>
              <div className="flex justify-between">
                <span>{nextAppointment.location}</span>
                <span>{nextAppointment.mode}</span>
              </div>
            </div>
            <div className="mt-auto pt-5">
              <Link
                to="/appointments"
                className="block rounded-xl bg-jade py-2.5 text-center text-sm font-bold text-deep transition-opacity hover:opacity-90"
              >
                Prepare for visit
              </Link>
            </div>
          </div>
        </section>

        {/* MEDS */}
        <section className="col-span-12 animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_both] [animation-delay:280ms] lg:col-span-5">
          <Link
            to="/meds"
            className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur-md transition-colors hover:bg-white/85"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-jade">Section B</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Meds</h2>
              </div>
              <span className="grid size-9 place-items-center rounded-full bg-deep text-white transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="size-4" />
              </span>
            </div>
            <p className="mt-1 text-sm text-ink/60">Prescription schedule</p>
            <div className="mt-5 space-y-2">
              {medsWeek.Tue.map((m, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-white/70 px-3.5 py-2.5">
                  <span className={`text-sm font-medium ${m.done ? "" : "text-ink/50"}`}>
                    {m.label} · {m.time}
                  </span>
                  <Dot done={m.done} />
                </div>
              ))}
            </div>
            <p className="mt-auto pt-5 font-mono text-[11px] text-ink/50">Tap for full weekly timetable →</p>
          </Link>
        </section>

        {/* DOCTORS */}
        <section className="col-span-12 animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_both] [animation-delay:340ms] lg:col-span-7">
          <div className="h-full rounded-[22px] bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-jade">Care team</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Consulting doctors</h2>
              </div>
              <span className="font-mono text-[11px] text-ink/40">{doctors.length} active</span>
            </div>
            <div className="mt-5 space-y-3">
              {doctors.map((doc) => (
                <div key={doc.name} className="flex items-center gap-3 rounded-xl bg-white/70 p-3">
                  <img
                    src={doc.img}
                    alt={doc.name}
                    width={816}
                    height={816}
                    loading="lazy"
                    className="size-11 shrink-0 rounded-full object-cover outline-1 -outline-offset-1 outline-black/5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{doc.name}</p>
                    <p className="truncate text-[12px] text-ink/50">{doc.role}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] ${
                      doc.tag === "Primary" ? "bg-jade/15 text-jade" : "bg-white/70 text-ink/50"
                    }`}
                  >
                    {doc.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
