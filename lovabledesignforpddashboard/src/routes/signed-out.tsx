import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/signed-out")({
  head: () => ({
    meta: [
      { title: "Signed out — YourHealthCo" },
      { name: "description", content: "You have been signed out of YourHealthCo." },
    ],
  }),
  component: SignedOutPage,
});

function SignedOutPage() {
  return (
    <div className="grid min-h-screen w-full place-items-center bg-mist font-sans text-ink antialiased">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full bg-jade/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-16 h-[560px] w-[560px] rounded-full bg-deep/20 blur-3xl" />
      </div>
      <div className="relative w-full max-w-sm rounded-[24px] bg-deep p-8 text-center text-white ring-1 ring-black/5">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-jade font-extrabold text-deep">
          YH
        </div>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight">You've been signed out</h1>
        <p className="mt-2 text-sm text-white/50">
          Thanks for visiting YourHealthCo. Sign back in to see your meals, meds, and appointments.
        </p>
        <Link
          to="/"
          className="mt-6 block rounded-xl bg-jade py-2.5 text-sm font-bold text-deep transition-opacity hover:opacity-90"
        >
          Sign back in
        </Link>
      </div>
    </div>
  );
}
