import "./Admin.css";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../../styles/admin/Admin.css";
import Sidebar from "../Sidebar/Sidebar";
import PatientCard from "../PatientCard/PatientCard";
import api from "../../../services/api";

const Admin = () => {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState("All");
  const location = useLocation();
  const { instituteName, address, id } = location.state || {};

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get(`/admin/users?cb=${Date.now()}`);
        // ApiResponse format: { success, message, data: { users }, error }
        const users = response?.data?.users || [];
        setPatients(users);
        console.log(users);
      } catch (err) {
        console.error("Failed to fetch admin's patients:", err.message);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    if (filter === "All") return true;
    if (filter === "Admitted") return patient.admitted === true;
    if (filter === "Not Admitted") return patient.admitted === false;
    return true;
  });

  return (
    <div className="dashboard-container">
      <Sidebar admin={instituteName} id={id} />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Patient Dashboard</h1>
        </div>
        <select
          className="filter-dropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Patients</option>
          <option value="Admitted">Admitted</option>
          <option value="Not Admitted">Not Admitted</option>
        </select>

        <div className="patient-grid">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <PatientCard
                key={patient._id}
                patient={patient}
                instituteName={instituteName}
              />
            ))
          ) : (
            <p className="no-patients">No patients found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
