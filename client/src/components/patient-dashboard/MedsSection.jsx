import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Dot from "./Dot";

export default function MedsSection({ currentMeds }) {
  return (
    <section className="col-span-12 animate-rise lg:col-span-5" style={{ animationDelay: '280ms' }}>
      <Link
        to="/meds"
        className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur-md transition-colors hover:bg-white/85"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-jade">Section B</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Meds</h2>
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-deep text-white transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="size-4" />
          </span>
        </div>
        <p className="mt-1 text-sm text-ink/60">Prescription schedule</p>
        <div className="mt-5 space-y-2">
          {currentMeds.map((m, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 shadow-sm border border-slate-100">
              <span className={`text-sm font-medium ${m.done ? "text-slate-900" : "text-ink/50"}`}>
                {m.label} <span className="opacity-50">· {m.time}</span>
              </span>
              <Dot done={m.done} />
            </div>
          ))}
        </div>
        <p className="mt-auto pt-5 font-mono text-[11px] text-ink/50">Tap for full weekly timetable →</p>
      </Link>
    </section>
  );
}
