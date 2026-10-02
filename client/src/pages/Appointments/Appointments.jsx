import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/patient-dashboard/DashboardLayout";
import { getProfile } from "../../services/userService";
import { getAppointments, requestAppointment, deleteAppointment } from "../../services/appointmentService";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    notes: "",
    mode: "Telehealth"
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await requestAppointment(formData);
      alert("Appointment request sent to admin!");
      setShowRequestForm(false);
      setFormData({ title: "", date: "", time: "", notes: "", mode: "Telehealth" });
      // Refresh appointments
      const profileRes = await getProfile();
      const profile = profileRes?.data || profileRes;
      const apptsRes = await getAppointments(profile._id);
      const appts = apptsRes?.data || apptsRes?.data?.data || [];
      setAppointments(appts);
    } catch (err) {
      console.error("Failed to request appointment:", err);
      alert("Error requesting appointment: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      setDeletingId(appointmentId);
      await deleteAppointment(appointmentId);
      // Remove from list
      setAppointments(prev => prev.filter(appt => appt._id !== appointmentId));
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      alert("Error deleting appointment: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
         <div className="flex items-center justify-center h-full">
           <p className="text-slate-500 animate-pulse">Loading Appointments...</p>
         </div>
      </DashboardLayout>
    );
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const validAppointments = appointments.filter(appt => {
    if (!appt || !appt.date) return false;
    const apptDate = new Date(appt.date);
    return apptDate >= startOfToday;
  });

  return (
    <DashboardLayout>
      <header className="animate-rise">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-jade">Schedule</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-balance text-slate-900">Appointments</h1>
      </header>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="bg-[#00D09C] hover:bg-[#00b88a] text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-sm transition"
        >
          {showRequestForm ? "Cancel" : "+ Request Appointment"}
        </button>
      </div>

      {showRequestForm && (
        <div className="mt-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Request Appointment</h2>
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="e.g. Nutrition follow-up"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Mode
              </label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
              >
                <option value="Telehealth">Telehealth</option>
                <option value="In-person">In-person</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Notes
              </label>
              <textarea
                placeholder="e.g. Reason for visit"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRequestForm(false)}
                className="border border-slate-200 bg-white text-slate-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#00D09C] hover:bg-[#00b88a] text-white font-semibold text-sm px-6 py-2 rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 space-y-6">
        {validAppointments.length === 0 ? (
          <p className="text-slate-500">No appointments scheduled.</p>
        ) : (
          validAppointments.map((appt, i) => (
            <section key={appt._id || i} className="animate-rise" style={{ animationDelay: `${120 + i * 100}ms` }}>
              <div className={`max-w-2xl rounded-[22px] ring-1 ring-black/5 shadow-xl ${
                appt.status === 'Rejected' ? 'bg-slate-800 p-6 text-white' : 'bg-deep p-6 text-white'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-jade">Upcoming</p>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight">{appt.title || "Appointment"}</h2>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-medium ${
                    appt.status === 'Pending'
                      ? 'bg-amber-100 text-amber-700'
                      : appt.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-jade text-deep'
                  }`}>
                    {appt.status === 'Pending' ? 'Pending Request' : appt.status === 'Rejected' ? 'Rejected' : 'Scheduled'}
                  </span>
                </div>
                {appt.status !== 'Rejected' && (
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
                )}
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
                {appt.status === 'Rejected' && (
                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={() => handleDeleteAppointment(appt._id)}
                      disabled={deletingId === appt._id}
                      className="bg-[#00D09C] hover:bg-[#00b88a] text-white font-semibold text-sm px-4 py-2 rounded-xl transition disabled:opacity-50"
                    >
                      {deletingId === appt._id ? "Processing..." : "OK"}
                    </button>
                  </div>
                )}
              </div>
            </section>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
