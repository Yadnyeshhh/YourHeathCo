import React from "react";
import { DashboardLayout } from "./DashboardLayout";
import Dot from "./Dot";
import { weekDays } from "../../data/healthData";

export function TimetablePage({ section, title, subtitle, data, profile }) {
  return (
    <DashboardLayout profile={profile}>
      <header className="animate-rise">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-jade">{section}</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-balance text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-ink/60">{subtitle}</p>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {weekDays.map((day, i) => {
          const items = data[day] || [];
          const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
          const isToday = day === currentDayName;
          return (
            <div
              key={day}
              className={`rounded-[22px] p-6 backdrop-blur-md animate-rise transition-all ${
                isToday
                  ? "bg-white ring-2 ring-jade shadow-lg"
                  : "bg-white/70 ring-1 ring-black/5"
              }`}
              style={{ animationDelay: `${120 + i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">{day}</h2>
                {isToday && (
                  <span className="rounded-full bg-jade/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-jade uppercase tracking-wider">
                    Today
                  </span>
                )}
              </div>
              {items.length === 0 ? (
                <p className="text-sm text-ink/40">No entries for this day.</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 shadow-sm border border-slate-100">
                      <span className={`text-sm font-medium ${item.done ? "text-slate-900" : "text-ink/50"}`}>
                        {item.label} <span className="opacity-50">· {item.time}</span>
                      </span>
                      <Dot done={item.done} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
