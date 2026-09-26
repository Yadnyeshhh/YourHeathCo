import React from "react";
import { Link } from "react-router-dom";

export default function AppointmentsSection({ nextAppointment }) {
  return (
    <section className="col-span-12 animate-rise lg:col-span-5" style={{ animationDelay: '220ms' }}>
      <div className="flex h-full flex-col rounded-[22px] bg-deep p-6 text-white ring-1 ring-black/5 shadow-xl">
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
  );
}
