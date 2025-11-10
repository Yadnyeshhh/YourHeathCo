import React, { useState, useEffect } from "react";
import "../stylesheets/PD.css";
import Sidebar from "../components/patientdashboard-components/Sidebar";
import Header from "../components/patientdashboard-components/Header";
import DashboardCard from "../components/patientdashboard-components/DashboardCard";
import ProgramSection from "../components/patientdashboard-components/ProgramSection";
import BillingSection from "../components/patientdashboard-components/BillingSection";
import TeamTodaySection from "../components/patientdashboard-components/TeamTodaySection";
import { FaBars } from "react-icons/fa"; // For toggle icon
const apiUrl = import.meta.env.VITE_API_URL;

import {
  navItems,
  topCardsData,
  programData,
  teamTodayData,
} from "../data/mockData";

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [medications, setMedications] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ NEW

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const { token } = JSON.parse(userData);

      try {
        const res = await fetch(`${apiUrl}/api/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Unauthorized");
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // Create patient schedule if not exists
  useEffect(() => {
    const createPatientSchedule = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/meds_meals/create/${profile._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const data = await response.json();
          console.error("Error creating schedule:", data.error);
        }
      } catch (err) {
        console.error("Network error:", err.message);
      }
    };

    if (profile && profile._id) createPatientSchedule();
  }, [profile]);

  // Fetch schedule data
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/meds_meals/patient/${profile._id}/schedule`);
        if (!res.ok) throw new Error("Failed to fetch schedule");

        const data = await res.json();
        setSchedule(data);
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
      }
    };

    if (profile?._id) fetchSchedule();
  }, [profile]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="dashboard-app-container">
      {/* ✅ Mobile toggle button */}
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FaBars size={20} />
      </button>

      {/* ✅ Overlay for mobile view */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* ✅ Sidebar (responsive with prop) */}
      <Sidebar
        navItems={navItems}
        profile={profile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ✅ Main Dashboard Content */}
      <div className="dashboard-main-content-area">
        <Header profile={profile} meds={medications} />
        <main className="dashboard-main-content-section">
          {/* Top Cards */}
          <div className="dashboard-top-cards-grid">
            {topCardsData.map((card, index) => (
              <DashboardCard
                key={index}
                {...card}
                meds={
                  ["medicines", "meals"].includes(card.title.toLowerCase()) && schedule
                    ? Object.entries(schedule).map(([day, data]) => ({
                        day,
                        medicines: data.medicines || [],
                        meal: data.meal || {},
                      }))
                    : []
                }
              />  
            ))}
          </div>

          {/* Middle Sections */}
          <div className="pbcontainer">
            <ProgramSection
              data={programData}
              nextAppointment={profile?.patientStatus?.nextAppointment}
            />
            <BillingSection />
            </div>
            <TeamTodaySection
              data={teamTodayData}
              doctor={profile?.patientStatus?.assignedDoctor}
            />
        
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
