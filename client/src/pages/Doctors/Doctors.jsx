import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/patient-dashboard/DashboardLayout";
import { getProfile } from "../../services/userService";
import { getAllDoctors } from "../../services/doctorService";

export default function Doctors() {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const profileRes = await getProfile();
        const profile = profileRes?.data || profileRes;
        
        const docsRes = await getAllDoctors();
        let docs = docsRes?.data || docsRes?.data?.data || [];
        
        if (profile.patientStatus) {
           const assignedDocId = profile.patientStatus.assignedDoctor?._id || profile.patientStatus.assignedDoctor;
           const consultingDocIds = (profile.patientStatus.consultingDoctors || []).map(d => d._id || d);
           docs = docs.filter(d => d._id === assignedDocId || consultingDocIds.includes(d._id));
        }
        
        setDoctorsList(docs);
      } catch (err) {
        console.error("Failed to load doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
         <div className="flex items-center justify-center h-full">
           <p className="text-slate-500 animate-pulse">Loading Doctors...</p>
         </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <header className="animate-rise">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-jade">Care team</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-balance text-slate-900">Consulting doctors</h1>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {doctorsList.length === 0 ? (
           <p className="text-slate-500 col-span-full">No consulting doctors assigned.</p>
        ) : (
          doctorsList.map((doc, i) => (
            <div
              key={doc._id || i}
              className="rounded-[22px] bg-white p-6 ring-1 ring-black/5 shadow-sm border border-slate-100 animate-rise"
              style={{ animationDelay: `${120 + i * 80}ms` }}
            >
              <img
                src={doc.img || "/profile.png"}
                alt={doc.name}
                loading="lazy"
                className="size-20 rounded-2xl object-cover outline-1 -outline-offset-1 outline-black/5 bg-slate-50"
              />
              <h2 className="mt-4 text-lg font-extrabold tracking-tight text-slate-900">{doc.name}</h2>
              <p className="text-sm text-ink/50">{doc.role}</p>
              <span
                className={`mt-4 inline-block rounded-full px-2.5 py-1 font-mono text-[10px] ${
                  doc.tag === "Primary" ? "bg-jade/15 text-jade" : "bg-slate-100 text-ink/50"
                }`}
              >
                {doc.tag || "Consulting"}
              </span>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
