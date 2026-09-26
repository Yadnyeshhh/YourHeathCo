import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Dot from "./Dot";

export default function MealsSection({ currentMeals, weekDays, mealsWeek }) {
  return (
    <section className="col-span-12 animate-rise lg:col-span-7" style={{ animationDelay: '160ms' }}>
      <Link
        to="/meals"
        className="group block h-full overflow-hidden rounded-[22px] bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur-md transition-colors hover:bg-white/85"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-jade">Section A</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Meals</h2>
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-deep text-white transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="size-4" />
          </span>
        </div>
        <p className="mt-1 text-sm text-ink/60">Weekly nutrition plan</p>
        <div className="mt-5 grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => {
            const active = i < 2; // Mon, Tue
            return (
              <div
                key={day}
                className={`rounded-lg py-2 text-center ${active ? "bg-jade/15" : "bg-white/60"}`}
              >
                <p className={`font-mono text-[10px] ${active ? "text-jade" : "text-ink/40"}`}>{day[0]}</p>
                <p className={`mt-1 text-[11px] font-semibold ${active ? "text-slate-900" : "text-ink/40"}`}>
                  {mealsWeek[day].length}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-5 space-y-2">
          {currentMeals.slice(0, 3).map((m, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 shadow-sm border border-slate-100">
              <span className={`text-sm font-medium ${m.done ? "text-slate-900" : "text-ink/50"}`}>
                {m.label} <span className="opacity-50">· {m.time}</span>
              </span>
              <Dot done={m.done} />
            </div>
          ))}
        </div>
        <p className="mt-5 font-mono text-[11px] text-ink/50">Tap for full weekly timetable →</p>
      </Link>
    </section>
  );
}
