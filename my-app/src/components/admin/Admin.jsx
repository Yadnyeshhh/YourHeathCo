import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./stylesheets/Admin.css";
import Sidebar from "./Sidebar";
import PatientCard from "./PatientCard";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const Admin = () => {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState("All"); // 👈 state for filter option
   const location = useLocation();
 
  const { instituteName, address } = location.state || {};
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const storedAdmin = localStorage.getItem("admin");
        if (!storedAdmin) {
          console.warn("No admin data found in localStorage.");
          return;
        }

        const admin = JSON.parse(storedAdmin);
        const token = admin?.token;
   

        if (!token) {
          console.warn("No admin token found. Admin not logged in.");
          return;
        }

        const res = await axios.get(`${apiUrl}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPatients(res.data);
      } catch (err) {
        console.error("Failed to fetch admin's patients:", err);
      }
    };

    fetchPatients();
  }, []);
  console.log(patients)

  //  Filter logic
  const filteredPatients = patients.filter((patient) => {
    if (filter === "All") return true;
    if (filter === "Admitted") return patient.admitted === true;
    if (filter === "Not Admitted") return patient.admitted === false;
    return true;
  });

  return (
    <div className="dashboard-container">
      <Sidebar admin = {instituteName}  />
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

        {/* 🩺 Patient Cards */}
        <div className="patient-grid">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <PatientCard key={patient._id} patient={patient} />
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
