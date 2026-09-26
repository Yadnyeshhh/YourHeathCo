import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import patientImg from "@/assets/patient.jpg";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — YourHealthCo" },
      { name: "description", content: "Your patient profile and account details." },
      { property: "og:title", content: "Profile — YourHealthCo" },
      { property: "og:description", content: "Your patient profile and account details." },
    ],
  }),
  component: ProfilePage,
});

const details = [
  { label: "Patient ID", value: "#YH-4471" },
  { label: "Date of birth", value: "12 Mar 1978" },
  { label: "Blood type", value: "O+" },
  { label: "Primary physician", value: "Dr. Lena Park" },
  { label: "Email", value: "amara.osei@example.com" },
  { label: "Phone", value: "+1 (555) 014-4471" },
];

function ProfilePage() {
  return (
    <DashboardLayout>
      <header className="animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_both]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-jade">Account</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-balance">Profile</h1>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <section className="rounded-[22px] bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur-md animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_both] [animation-delay:120ms]">
          <img
            src={patientImg}
            alt="Amara Osei"
            width={816}
            height={816}
            className="size-24 rounded-2xl object-cover outline-1 -outline-offset-1 outline-black/5"
          />
          <h2 className="mt-4 text-xl font-extrabold tracking-tight">Amara Osei</h2>
          <p className="font-mono text-[11px] text-ink/40">ID #YH-4471</p>
          <button className="mt-5 w-full rounded-xl bg-deep py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90">
            Edit profile
          </button>
        </section>

        <section className="rounded-[22px] bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur-md animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_both] [animation-delay:200ms] lg:col-span-2">
          <h2 className="text-lg font-extrabold tracking-tight">Details</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label} className="flex items-center justify-between rounded-xl bg-white/70 px-3.5 py-2.5">
                <span className="text-sm text-ink/50">{d.label}</span>
                <span className="text-sm font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
