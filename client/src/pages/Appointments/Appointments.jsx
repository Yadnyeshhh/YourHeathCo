import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/patient-dashboard/DashboardLayout";
import { getProfile } from "../../services/userService";
import { getAppointments } from "../../services/appointmentService";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppts = async () => {
      try {
        setLoading(true);
        const profileRes = await getProfile();
        const profile = profileRes?.data || profileRes;
        
        const apptsRes = await getAppointments(profile._id);
        const appts = apptsRes?.data || apptsRes?.data?.data || [];
        setAppointments(appts);
      } catch (err) {
        console.error("Failed to load appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppts();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
         <div className="flex items-center justify-center h-full">
           <p className="text-slate-500 animate-pulse">Loading Appointments...</p>
         </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <header className="animate-rise">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-jade">Schedule</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-balance text-slate-900">Appointments</h1>
      </header>

      <div className="mt-6 space-y-6">
        {appointments.length === 0 ? (
          <p className="text-slate-500">No appointments scheduled.</p>
        ) : (
          appointments.map((appt, i) => (
            <section key={appt._id || i} className="animate-rise" style={{ animationDelay: `${120 + i * 100}ms` }}>
              <div className="max-w-2xl rounded-[22px] bg-deep p-6 text-white ring-1 ring-black/5 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-jade">Upcoming</p>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight">{appt.title || "Appointment"}</h2>
                  </div>
                  <span className="rounded-full bg-jade px-2.5 py-1 font-mono text-[10px] font-medium text-deep">
                    Scheduled
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <img
                    src={appt.doctorImg || "/profile.png"}
                    alt={appt.doctorName || "Doctor"}
                    loading="lazy"
                    className="size-12 shrink-0 rounded-full object-cover outline-1 -outline-offset-1 outline-white/10 bg-slate-800"
                  />
                  <div>
                    <p className="text-sm font-semibold">{appt.doctorName || "Doctor"}</p>
                    <p className="text-[12px] text-white/50">{appt.doctorRole}</p>
                  </div>
                </div>
                <div className="mt-5 space-y-2.5 border-t border-white/10 pt-5 font-mono text-[12px] text-white/70">
                  <div className="flex justify-between">
                    <span>{new Date(appt.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span>{appt.time || "TBD"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{appt.location || "TBD"}</span>
                    <span>{appt.mode || "In-person"}</span>
                  </div>
                </div>
              </div>
            </section>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
