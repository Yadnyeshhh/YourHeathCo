import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../AdminHeader";
import { getSchedule, updateMeds } from "../../../services/scheduleService";
import { updatePatientStatus } from "../../../services/patientStatusService";
import { getAppointments, updateAppointment } from "../../../services/appointmentService";
import { getAllDoctors, createDoctor, deleteDoctor } from "../../../services/doctorService";
import api from "../../../services/api";

const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const emptyWeeklySchedule = {
  monday: { meals: [], medicines: [] },
  tuesday: { meals: [], medicines: [] },
  wednesday: { meals: [], medicines: [] },
  thursday: { meals: [], medicines: [] },
  friday: { meals: [], medicines: [] },
  saturday: { meals: [], medicines: [] },
  sunday: { meals: [], medicines: [] },
};

export default function PatientDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(state?.patient || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Status Flag
  const [statusFlag, setStatusFlag] = useState("Stable");

  // Appointment Form State (no default mock text)
  const [apptTitle, setApptTitle] = useState("");
  const [apptDoctor, setApptDoctor] = useState("");
  const [apptStatusNote, setApptStatusNote] = useState("");
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [apptLocation, setApptLocation] = useState("");
  const [apptMode, setApptMode] = useState("Telehealth");

  // Doctors & Care Team State
  const [allDoctorsList, setAllDoctorsList] = useState([]);
  const [selectedDoctorIds, setSelectedDoctorIds] = useState([]);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [newDoctorName, setNewDoctorName] = useState("");
  const [newDoctorRole, setNewDoctorRole] = useState("");
  const [creatingDoctor, setCreatingDoctor] = useState(false);

  // Schedule (Meals & Meds)
  const [schedule, setSchedule] = useState(emptyWeeklySchedule);

  useEffect(() => {
    const targetId = id || patient?._id;
    if (!targetId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Doctors from DB (isolated for this patient)
        let docs = [];
        try {
          const docsRes = await getAllDoctors(targetId);
          docs = docsRes?.data?.data || docsRes?.data || docsRes || [];
          if (!Array.isArray(docs)) docs = [];
        } catch (e) {
          console.warn("Doctors fetch failed:", e);
        }
        setAllDoctorsList(docs);

        // 2. Fetch User Info if needed
        let currentUser = patient;
        if (!currentUser) {
          const userRes = await api.get(`/user/${targetId}`);
          currentUser = userRes?.data?.user || userRes?.data || userRes;
          setPatient(currentUser);
        }

        // Status Flag from DB
        if (currentUser?.patientStatus?.statusFlag) {
          setStatusFlag(currentUser.patientStatus.statusFlag);
        }

        // Assigned Doctors from DB (empty by default if none assigned)
        const initialSelected = [];
        if (currentUser?.patientStatus?.assignedDoctor) {
          const aId = currentUser.patientStatus.assignedDoctor._id || currentUser.patientStatus.assignedDoctor;
          if (aId) initialSelected.push(aId);
        }
        if (currentUser?.patientStatus?.consultingDoctors && Array.isArray(currentUser.patientStatus.consultingDoctors)) {
          currentUser.patientStatus.consultingDoctors.forEach(d => {
            const cId = d._id || d;
            if (cId && !initialSelected.includes(cId)) initialSelected.push(cId);
          });
        }
        setSelectedDoctorIds(initialSelected);

        // 3. Fetch Schedule from DB
        try {
          const schedRes = await getSchedule(targetId);
          const rawSched = schedRes?.data?.schedule || schedRes?.data || schedRes;
          if (rawSched && typeof rawSched === 'object') {
            const normalizedSched = { ...emptyWeeklySchedule };
            DAYS_OF_WEEK.forEach(day => {
              if (rawSched[day]) {
                normalizedSched[day] = {
                  meals: rawSched[day].meals || rawSched[day].meal || [],
                  medicines: rawSched[day].medicines || rawSched[day].medicine || [],
                };
              }
            });
            setSchedule(normalizedSched);
          }
        } catch (err) {
          console.warn("Could not fetch schedule:", err);
        }

        // 4. Fetch Appointments from DB
        try {
          const apptRes = await getAppointments(targetId);
          const appts = apptRes?.data?.data || apptRes?.data || apptRes;
          if (Array.isArray(appts) && appts.length > 0) {
            const latest = appts[0];
            if (latest.title) setApptTitle(latest.title);
            if (latest.doctorName) setApptDoctor(latest.doctorName);
            if (latest.notes) setApptStatusNote(latest.notes);
            if (latest.date) setApptDate(new Date(latest.date).toISOString().split('T')[0]);
            if (latest.time) setApptTime(latest.time);
            if (latest.location) setApptLocation(latest.location);
            if (latest.mode) setApptMode(latest.mode);
          }
        } catch (e) {
          console.warn("Could not fetch appointments:", e);
        }

      } catch (err) {
        console.error("Error setting up patient details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Doctor Selection Toggle
  const toggleDoctorSelection = (docId) => {
    if (selectedDoctorIds.includes(docId)) {
      setSelectedDoctorIds(selectedDoctorIds.filter(d => d !== docId));
    } else {
      setSelectedDoctorIds([...selectedDoctorIds, docId]);
    }
  };

  // Remove Doctor Handler
  const handleRemoveDoctor = async (e, docId) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to remove this doctor?");
    if (!confirmDelete) return;

    try {
      await deleteDoctor(docId);
      setAllDoctorsList(prev => prev.filter(d => d._id !== docId));
      setSelectedDoctorIds(prev => prev.filter(id => id !== docId));
    } catch (err) {
      console.error("Failed to remove doctor:", err);
      alert("Could not remove doctor: " + err.message);
    }
  };
  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    const targetId = id || patient?._id;
    if (!newDoctorName.trim() || !newDoctorRole.trim()) return;
    try {
      setCreatingDoctor(true);
      const res = await createDoctor({
        name: newDoctorName.trim(),
        role: newDoctorRole.trim(),
        patientId: targetId,
      });
      const created = res?.data?.data || res?.data || res;
      if (created && created._id) {
        setAllDoctorsList(prev => [...prev, created]);
        setSelectedDoctorIds(prev => [...prev, created._id]);
      }
      setNewDoctorName("");
      setNewDoctorRole("");
      setIsAddingDoctor(false);
    } catch (err) {
      console.error("Failed to add doctor:", err);
      alert("Could not add doctor: " + err.message);
    } finally {
      setCreatingDoctor(false);
    }
  };

  // Schedule Modification Handlers (label & time)
  const handleMealChange = (day, index, field, value) => {
    const updated = { ...schedule };
    const meals = [...(updated[day]?.meals || [])];
    meals[index] = { ...meals[index], [field]: value };
    updated[day] = { ...updated[day], meals };
    setSchedule(updated);
  };

  const handleAddMeal = (day) => {
    const updated = { ...schedule };
    const meals = [...(updated[day]?.meals || []), { label: "Meal", time: "12:00" }];
    updated[day] = { ...updated[day], meals };
    setSchedule(updated);
  };

  const handleDeleteMeal = (day, index) => {
    const updated = { ...schedule };
    const meals = (updated[day]?.meals || []).filter((_, i) => i !== index);
    updated[day] = { ...updated[day], meals };
    setSchedule(updated);
  };

  const handleMedChange = (day, index, field, value) => {
    const updated = { ...schedule };
    const medicines = [...(updated[day]?.medicines || [])];
    medicines[index] = { ...medicines[index], [field]: value };
    updated[day] = { ...updated[day], medicines };
    setSchedule(updated);
  };

  const handleAddMed = (day) => {
    const updated = { ...schedule };
    const medicines = [...(updated[day]?.medicines || []), { label: "Medication", time: "08:00" }];
    updated[day] = { ...updated[day], medicines };
    setSchedule(updated);
  };

  const handleDeleteMed = (day, index) => {
    const updated = { ...schedule };
    const medicines = (updated[day]?.medicines || []).filter((_, i) => i !== index);
    updated[day] = { ...updated[day], medicines };
    setSchedule(updated);
  };

  // Global Save Changes handler
  const handleSaveChanges = async () => {
    const targetId = id || patient?._id;
    if (!targetId) return;

    try {
      setSaving(true);
      setSaveSuccess(false);

      // 1. Update Patient Status & Care Team
      const primaryDoc = selectedDoctorIds[0] || null;
      const consultingDocs = selectedDoctorIds.slice(1);
      await updatePatientStatus(targetId, {
        statusFlag,
        assignedDoctor: primaryDoc,
        consultingDoctors: consultingDocs,
      });

      // 2. Update Appointment (if title, date, time, or location provided)
      if (apptTitle || apptDate || apptTime || apptDoctor || apptLocation) {
        const selectedDocObj = allDoctorsList.find(d => d._id === apptDoctor || d.name === apptDoctor);
        await updateAppointment(targetId, {
          title: apptTitle,
          doctorName: selectedDocObj ? selectedDocObj.name : apptDoctor,
          doctorRole: selectedDocObj ? selectedDocObj.role : "",
          notes: apptStatusNote,
          date: apptDate || new Date().toISOString().split('T')[0],
          time: apptTime || "09:00",
          location: apptLocation,
          mode: apptMode,
        });
      }

      // 3. Update Schedule (Meals & Meds)
      const cleanSchedule = {};
      DAYS_OF_WEEK.forEach(day => {
        cleanSchedule[day] = {
          meals: (schedule[day]?.meals || []).map(m => ({
            label: m.label && m.label.trim() ? m.label.trim() : "Meal",
            time: m.time && m.time.trim() ? m.time.trim() : "12:00",
            done: Boolean(m.done)
          })),
          medicines: (schedule[day]?.medicines || []).map(m => ({
            label: m.label && m.label.trim() ? m.label.trim() : "Medication",
            time: m.time && m.time.trim() ? m.time.trim() : "08:00",
            done: Boolean(m.done)
          }))
        };
      });
      await updateMeds(targetId, cleanSchedule);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save patient details:", err);
      alert("Error saving updates: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Unassign Patient Handler
  const handleUnassignPatient = async () => {
    const targetId = id || patient?._id;
    if (!targetId) return;

    const confirmUnassign = window.confirm(
      `Are you sure you want to unassign ${patient?.name || "this patient"}? This will remove them from your admin dashboard.`
    );
    if (!confirmUnassign) return;

    try {
      await api.patch(`/user/unassign/${targetId}`);
      alert("Patient successfully unassigned!");
      navigate("/admin");
    } catch (err) {
      console.error("Failed to unassign patient:", err);
      alert("Error unassigning patient: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF3F5] font-sans flex flex-col">
        <AdminHeader />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400 animate-pulse text-sm">Loading patient details...</p>
        </div>
      </div>
    );
  }

  const patientName = patient?.name || "Patient";
  const shortId = `ID #YH-${(id || patient?._id || "").slice(-4).toUpperCase()}`;
  const ageGenderBlood = `${patient?.age || "--"} yrs • ${patient?.gender || "--"} • ${patient?.bloodGroup || "--"}`;
  const avatarSrc = patient?.profileImage
    ? (patient.profileImage.startsWith("http") ? patient.profileImage : `http://localhost:3000/${patient.profileImage}`)
    : "/profile.png";

  return (
    <div className="min-h-screen bg-[#EBF3F5] text-slate-900 font-sans flex flex-col pb-16">
      <AdminHeader />

      <main className="max-w-6xl w-full mx-auto px-6 pt-6">
        {/* Back Link */}
        <button
          onClick={() => navigate("/admin")}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-5 transition"
        >
          ← All patients
        </button>

        {/* Patient Summary Header Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={avatarSrc}
              alt={patientName}
              className="w-14 h-14 rounded-full object-cover border border-slate-200 bg-slate-50"
              onError={(e) => { e.target.src = "/profile.png"; }}
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">{patientName}</h1>
                <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-0.5 rounded-full font-semibold border border-emerald-200">
                  {statusFlag}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">
                {shortId} • {ageGenderBlood}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg animate-fade">
                ✓ Saved successfully
              </span>
            )}
            <button
              type="button"
              onClick={handleUnassignPatient}
              className="border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-600 font-semibold text-xs px-4 py-2.5 rounded-xl transition"
            >
              Unassign Patient
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="bg-[#00D09C] hover:bg-[#00b88a] text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        {/* 3 Grid Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Set Appointment */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-[#00D09C] uppercase">
                    NEXT UP
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">Set appointment</h2>
                </div>
                {apptStatusNote && (
                  <span className="bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {apptStatusNote}
                  </span>
                )}
              </div>

              <div className="space-y-3 mt-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    TITLE
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nutrition follow-up"
                    value={apptTitle}
                    onChange={(e) => setApptTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      DOCTOR
                    </label>
                    <select
                      value={apptDoctor}
                      onChange={(e) => setApptDoctor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00D09C] truncate"
                    >
                      <option value="">-- Select Doctor --</option>
                      {allDoctorsList.map(doc => (
                        <option key={doc._id} value={doc.name}>
                          {doc.name} ({doc.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      STATUS NOTE
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. In 2 days"
                      value={apptStatusNote}
                      onChange={(e) => setApptStatusNote(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      DATE
                    </label>
                    <input
                      type="date"
                      value={apptDate}
                      onChange={(e) => setApptDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      TIME
                    </label>
                    <input
                      type="time"
                      value={apptTime}
                      onChange={(e) => setApptTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      LOCATION
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Room 204"
                      value={apptLocation}
                      onChange={(e) => setApptLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      MODE
                    </label>
                    <select
                      value={apptMode}
                      onChange={(e) => setApptMode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
                    >
                      <option value="Telehealth">Telehealth</option>
                      <option value="In-person">In-person</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Set Doctors / Care Team */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0B1E2D] flex items-center justify-center text-[#00D09C] text-sm">
                    🩺
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-[#00D09C] uppercase">
                      CARE TEAM
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">Set doctors</h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingDoctor(!isAddingDoctor)}
                  className="text-xs font-semibold text-[#00D09C] bg-[#00D09C]/10 hover:bg-[#00D09C]/20 border border-[#00D09C]/30 px-3 py-1 rounded-full transition"
                >
                  {isAddingDoctor ? "Cancel" : "+ Add Doctor"}
                </button>
              </div>

              {/* Inline Add Doctor Form */}
              {isAddingDoctor && (
                <form onSubmit={handleCreateDoctor} className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 space-y-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      DOCTOR NAME
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Lena Park"
                      value={newDoctorName}
                      onChange={(e) => setNewDoctorName(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      SPECIALTY / ROLE
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Clinical Nutritionist"
                      value={newDoctorRole}
                      onChange={(e) => setNewDoctorRole(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={creatingDoctor}
                    className="w-full bg-[#00D09C] hover:bg-[#00b88a] text-white font-semibold py-1.5 rounded-lg transition disabled:opacity-50 mt-1"
                  >
                    {creatingDoctor ? "Saving..." : "Save Doctor"}
                  </button>
                </form>
              )}

              {allDoctorsList.length > 0 ? (
                <div className="space-y-2.5 mt-2">
                  {allDoctorsList.map((doc) => {
                    const isSelected = selectedDoctorIds.includes(doc._id);
                    return (
                      <div
                        key={doc._id}
                        onClick={() => toggleDoctorSelection(doc._id)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? "bg-emerald-50/60 border-emerald-300 text-slate-900"
                            : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-xs text-slate-900">{doc.name}</p>
                          <p className="text-[11px] text-slate-400">{doc.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleRemoveDoctor(e, doc._id)}
                            className="text-slate-300 hover:text-red-500 text-xs font-bold transition px-1"
                            title="Remove Doctor"
                          >
                            ×
                          </button>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition ${
                            isSelected ? "bg-[#00D09C] text-white" : "border border-slate-300 bg-white"
                          }`}>
                            {isSelected && "✓"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No doctors available. Click "+ Add Doctor" above to add doctors.
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Care Flag Status (Dark Theme) */}
          <div className="bg-[#0B1E2D] text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-teal-400 uppercase">
                CHART STATUS
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">Care flag</h2>

              <div className="flex items-center gap-2.5 mt-6">
                {["Stable", "Monitor", "Review"].map((flag) => {
                  const isActive = statusFlag === flag;
                  return (
                    <button
                      key={flag}
                      onClick={() => setStatusFlag(flag)}
                      className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition ${
                        isActive
                          ? flag === "Stable"
                            ? "bg-[#00D09C] text-slate-950 shadow-md"
                            : flag === "Monitor"
                            ? "bg-amber-400 text-slate-950 shadow-md"
                            : "bg-rose-500 text-white shadow-md"
                          : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {flag}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mt-6">
              Saving updates this patient's meals, meds, appointment, and care team. Changes apply immediately in the admin view.
            </p>
          </div>
        </div>

        {/* MEALS WEEKLY TIMETABLE SECTION */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-[#00D09C] uppercase">
                MEALS
              </span>
              <span className="text-slate-400 mx-2 text-xs">•</span>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                WEEKLY TIMETABLE
              </span>
            </div>
            <span className="text-xs text-slate-400">Edit meal labels & times, then save</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {DAYS_OF_WEEK.map((day) => {
              const dayMeals = schedule[day]?.meals || [];
              return (
                <div key={`meal-${day}`} className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-xs text-slate-800">{DAY_LABELS[day]}</span>
                      <button
                        onClick={() => handleAddMeal(day)}
                        className="text-[10px] font-bold bg-[#00D09C]/10 text-[#00D09C] hover:bg-[#00D09C]/20 px-2 py-0.5 rounded-full transition"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="space-y-2">
                      {dayMeals.map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-lg p-2 shadow-2xs space-y-1 relative group">
                          <input
                            type="text"
                            placeholder="Meal name (e.g. Lunch)"
                            value={item.label || ""}
                            onChange={(e) => handleMealChange(day, idx, "label", e.target.value)}
                            className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
                          />
                          <div className="flex items-center justify-between pt-0.5">
                            <input
                              type="text"
                              placeholder="Time (e.g. 12:30)"
                              value={item.time || ""}
                              onChange={(e) => handleMealChange(day, idx, "time", e.target.value)}
                              className="w-full text-[11px] font-mono text-slate-500 bg-transparent focus:outline-none"
                            />
                            <button
                              onClick={() => handleDeleteMeal(day, idx)}
                              className="text-slate-300 hover:text-red-500 text-xs font-bold transition ml-1"
                              title="Delete meal"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                      {dayMeals.length === 0 && (
                        <p className="text-[11px] text-slate-300 italic text-center py-2">No meals</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MEDS WEEKLY TIMETABLE SECTION */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-[#00D09C] uppercase">
                MEDS
              </span>
              <span className="text-slate-400 mx-2 text-xs">•</span>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                WEEKLY TIMETABLE
              </span>
            </div>
            <span className="text-xs text-slate-400">Edit med labels & times, then save</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {DAYS_OF_WEEK.map((day) => {
              const dayMeds = schedule[day]?.medicines || [];
              return (
                <div key={`med-${day}`} className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-xs text-slate-800">{DAY_LABELS[day]}</span>
                      <button
                        onClick={() => handleAddMed(day)}
                        className="text-[10px] font-bold bg-[#00D09C]/10 text-[#00D09C] hover:bg-[#00D09C]/20 px-2 py-0.5 rounded-full transition"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="space-y-2">
                      {dayMeds.map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-lg p-2 shadow-2xs space-y-1 relative group">
                          <input
                            type="text"
                            placeholder="Med name (e.g. Aspirin)"
                            value={item.label || ""}
                            onChange={(e) => handleMedChange(day, idx, "label", e.target.value)}
                            className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
                          />
                          <div className="flex items-center justify-between pt-0.5">
                            <input
                              type="text"
                              placeholder="Time (e.g. 08:00)"
                              value={item.time || ""}
                              onChange={(e) => handleMedChange(day, idx, "time", e.target.value)}
                              className="w-full text-[11px] font-mono text-slate-500 bg-transparent focus:outline-none"
                            />
                            <button
                              onClick={() => handleDeleteMed(day, idx)}
                              className="text-slate-300 hover:text-red-500 text-xs font-bold transition ml-1"
                              title="Delete med"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                      {dayMeds.length === 0 && (
                        <p className="text-[11px] text-slate-300 italic text-center py-2">No meds</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
