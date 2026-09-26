import React from "react";
import { useNavigate } from "react-router-dom";

export default function PatientCard({ patient, instituteName }) {
  const navigate = useNavigate();

  const handleOpenChart = (e) => {
    e.stopPropagation();
    navigate(`/patient/${patient._id}`, {
      state: { patient, instituteName },
    });
  };

  // Status flag color mapping
  const statusFlag = patient?.patientStatus?.statusFlag || (patient?.admitted ? "Stable" : "Monitor");
  const getBadgeStyle = (status) => {
    switch (status) {
      case "Stable":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Monitor":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Review":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Format ID
  const shortId = `ID #YH-${(patient._id || "").slice(-4).toUpperCase()}`;

  // Next appointment info
  const nextAppt = patient?.appointments && patient.appointments.length > 0 ? patient.appointments[0] : null;
  const apptTitle = nextAppt?.title || (patient?.patientStatus?.nextAppointment ? "General Follow-up" : "No upcoming appointment");
  const apptDate = nextAppt?.date
    ? new Date(nextAppt.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
    : (patient?.patientStatus?.nextAppointment
        ? new Date(patient.patientStatus.nextAppointment).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
        : "");

  // Doctors care team
  const doctorsList = [];
  if (patient?.patientStatus?.assignedDoctor) {
    doctorsList.push(patient.patientStatus.assignedDoctor.name || patient.patientStatus.assignedDoctor);
  }
  if (patient?.patientStatus?.consultingDoctors && Array.isArray(patient.patientStatus.consultingDoctors)) {
    patient.patientStatus.consultingDoctors.forEach((doc) => {
      const docName = doc.name || doc;
      if (docName && !doctorsList.includes(docName)) {
        doctorsList.push(docName);
      }
    });
  }
  const doctorsString = doctorsList.length > 0 ? doctorsList.join(", ") : (patient?.assignedDoctor || "No doctor assigned");

  const avatarSrc = patient.profileImage
    ? (patient.profileImage.startsWith("http") ? patient.profileImage : `http://localhost:3000/${patient.profileImage}`)
    : "/profile.png";

  return (
    <div
      onClick={handleOpenChart}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-slate-100 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Header Row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={avatarSrc}
              alt={patient.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 bg-slate-50"
              onError={(e) => { e.target.src = "/profile.png"; }}
            />
            <div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight">{patient.name}</h3>
              <p className="text-xs font-mono text-slate-400 mt-0.5">{shortId}</p>
            </div>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getBadgeStyle(statusFlag)}`}>
            {statusFlag}
          </span>
        </div>

        {/* Divider */}
        <div className="border-b border-slate-100 my-4"></div>

        {/* Info Grid */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-500 font-mono">
            <span>{patient.age || "35"} yrs • {patient.gender || "Female"}</span>
            <span className="font-semibold text-slate-600">{patient.bloodGroup || "O+"}</span>
          </div>

          <div className="flex justify-between items-baseline font-mono text-slate-600 pt-1">
            <span className="font-sans font-medium text-slate-800">{apptTitle}</span>
            <span className="text-slate-400 text-[11px]">{apptDate}</span>
          </div>

          <p className="font-mono text-slate-400 text-[11px] truncate pt-0.5">
            {doctorsString}
          </p>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="mt-6 flex items-center justify-between pt-2">
        <span className="text-xs font-semibold text-[#00D09C] hover:underline flex items-center gap-1">
          Open chart
        </span>
        <div className="w-8 h-8 rounded-full bg-[#0B1E2D] flex items-center justify-center text-white text-xs group-hover:bg-slate-800 transition">
          →
        </div>
      </div>
    </div>
  );
}
