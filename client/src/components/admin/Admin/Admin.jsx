import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminHeader from "../AdminHeader";
import PatientCard from "../PatientCard/PatientCard";
import api from "../../../services/api";

const Admin = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const location = useLocation();
  const { instituteName } = location.state || {};

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/users?cb=${Date.now()}`);
        const users = response?.data?.users || [];
        setPatients(users);
      } catch (err) {
        console.error("Failed to fetch admin's patients:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    if (filter === "All") return true;
    const status = patient?.patientStatus?.statusFlag || (patient.admitted ? "Stable" : "Monitor");
    return status === filter;
  });

  return (
    <div className="min-h-screen bg-[#EBF3F5] text-slate-900 font-sans flex flex-col">
      <AdminHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#00D09C] uppercase">
              OVERVIEW
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Patients</h1>
            <p className="text-sm text-slate-500 mt-1">
              Select a patient to update their meals, meds, appointments, and care team.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              className="bg-white border border-slate-200 text-xs font-medium text-slate-700 px-3.5 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Stable">Stable</option>
              <option value="Monitor">Monitor</option>
              <option value="Review">Review</option>
            </select>
          </div>
        </div>

        {/* Patient Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-400 animate-pulse text-sm">Loading patients...</p>
          </div>
        ) : filteredPatients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient._id}
                patient={patient}
                instituteName={instituteName}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <p className="text-slate-500 font-medium">No patients found.</p>
            <p className="text-xs text-slate-400 mt-1">Click "+ Add Patient" above to assign new patients.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
