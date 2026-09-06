import "./PatientDashboard.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/patient-dashboard/Sidebar/Sidebar";
import Header from "../../components/patient-dashboard/Header/Header";
import DashboardCard from "../../components/patient-dashboard/DashboardCard/DashboardCard";
import AppointmentsSection from "../../components/patient-dashboard/AppointmentsSection/AppointmentsSection";
import TeamTodaySection from "../../components/patient-dashboard/TeamTodaySection/TeamTodaySection";
import { FaBars } from "react-icons/fa";
import { topCardsData, programData } from "../../data/mockData.js";
import { getProfile } from "../../services/userService";
import { getSchedule } from "../../services/scheduleService";

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const profileRes = await getProfile();
        const userProfile = profileRes?.data || profileRes;
        setProfile(userProfile);

        if (userProfile && userProfile._id) {
          try {
            const scheduleRes = await getSchedule(userProfile._id);
            setSchedule(scheduleRes?.data || scheduleRes);
          } catch (schedErr) {
            console.error("Schedule load error:", schedErr.message);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading || !profile) {
    return <div className="db-root-container" style={{ padding: '2rem' }}><p>Loading Dashboard...</p></div>;
  }

  return (
    <div className="db-root-container">
      <button className="db-root-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FaBars size={20} />
      </button>

      <div
        className={`db-root-sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <Sidebar
        profile={profile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="db-root-content-area">
        <Header profile={profile} meds={[]} />

        <main className="db-root-main">
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

          <div className="db-root-grid-layout">
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
            <div className="db-root-right-column"></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
