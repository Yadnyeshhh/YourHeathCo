import React from "react";

export default function DashboardHeader({ profile }) {
  const getFirstName = (name) => name?.split(" ")[0] || "there";
  
  return (
    <header className="flex items-end justify-between animate-rise">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-jade">Welcome</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-balance text-slate-900">
          Good morning, {getFirstName(profile?.name)}
        </h1>
      </div>
      <p className="hidden font-mono text-[11px] text-ink/40 sm:block">Week 20 · 4 of 7 done</p>
    </header>
  );
}
