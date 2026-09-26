import React from "react";

export default function DoctorsSection({ doctors }) {
  return (
    <section className="col-span-12 animate-rise lg:col-span-7" style={{ animationDelay: '340ms' }}>
      <div className="h-full rounded-[22px] bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-jade">Care team</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Consulting doctors</h2>
          </div>
          <span className="font-mono text-[11px] text-ink/40">{doctors.length} active</span>
        </div>
        <div className="mt-5 space-y-3">
          {doctors.map((doc, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm border border-slate-100">
              <img
                src={doc.img}
                alt={doc.name}
                loading="lazy"
                className="size-11 shrink-0 rounded-full object-cover outline-1 -outline-offset-1 outline-black/5"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{doc.name}</p>
                <p className="truncate text-[12px] text-ink/50">{doc.role}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] ${
                  doc.tag === "Primary" ? "bg-jade/15 text-jade" : "bg-slate-100 text-ink/50"
                }`}
              >
                {doc.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
