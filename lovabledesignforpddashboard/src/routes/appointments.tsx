import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { nextAppointment } from "@/lib/health-data";

export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "Appointments — YourHealthCo" },
      { name: "description", content: "Your upcoming appointments and visit details." },
      { property: "og:title", content: "Appointments — YourHealthCo" },
      { property: "og:description", content: "Your upcoming appointments and visit details." },
    ],
  }),
  component: AppointmentsPage,
});

function AppointmentsPage() {
  return (
    <DashboardLayout>
      <header className="animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_both]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-jade">Schedule</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-balance">Appointments</h1>
      </header>

      <section className="mt-6 animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_both] [animation-delay:120ms]">
        <div className="max-w-2xl rounded-[22px] bg-deep p-6 text-white ring-1 ring-black/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-jade">Next up</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight">{nextAppointment.title}</h2>
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
          <div className="mt-5">
            <button className="w-full rounded-xl bg-jade py-2.5 text-sm font-bold text-deep transition-opacity hover:opacity-90">
              Prepare for visit
            </button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
