import "./PatientDashboard.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/patient-dashboard/Sidebar/Sidebar";
import Header from "../../components/patient-dashboard/Header/Header";
import DashboardCard from "../../components/patient-dashboard/DashboardCard/DashboardCard";
import AppointmentsSection from "../../components/patient-dashboard/AppointmentsSection/AppointmentsSection";
import BillingSection from "../../components/patient-dashboard/BillingSection/BillingSection";
import TeamTodaySection from "../../components/patient-dashboard/TeamTodaySection/TeamTodaySection";
import { FaBars } from "react-icons/fa";
import { navItems, topCardsData, programData, teamTodayData } from "../../data/mockData.js";

const apiUrl = import.meta.env.VITE_API_URL;
const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [medications, setMedications] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

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
    <div className="db-root-container">
      {/* Mobile toggle button */}
      <button className="db-root-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FaBars size={20} />
      </button>

      {/* Overlay for mobile view */}
      <div
        className={`db-root-sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar - Persistent on desktop, offcanvas on mobile */}
      <Sidebar
        profile={profile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Dashboard Content */}
      <div className="db-root-content-area">
        <Header profile={profile} meds={medications} />

        <main className="db-root-main">
          {/* Top Row: Quick Access Icons */}
          <div className="db-root-top-cards">
            {topCardsData.map((card, index) => (
              <DashboardCard
                key={index}
                {...card}
                colorClass={card.colorClass || ""}
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

          {/* Lower Grid: Split layout for Vitals vs. Billing */}
          <div className="db-root-grid-layout">
            {/* Left Column: Appointments and Team */}
            <div className="db-root-left-column">
              <div className="db-root-vitals-group">
                <AppointmentsSection
                  data={programData}
                  nextAppointment={profile?.patientStatus?.nextAppointment}
                />
                <TeamTodaySection
                  doctor={profile?.patientStatus?.assignedDoctor}
                />
              </div>
            </div>

            {/* Right Column: Billing takes rest of width */}
            <div className="db-root-right-column">
              <BillingSection profile={profile} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;