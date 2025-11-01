import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../stylesheets/PD.css";
import Sidebar from '../components/patientdashboard-components/Sidebar';
import Header from '../components/patientdashboard-components/Header';
import DashboardCard from '../components/patientdashboard-components/DashboardCard';
import ProgramSection from '../components/patientdashboard-components/ProgramSection';
import BillingSection from '../components/patientdashboard-components/BillingSection';
import TeamTodaySection from '../components/patientdashboard-components/TeamTodaySection';
const apiUrl = import.meta.env.VITE_API_URL;

import {
  navItems,
  topCardsData,
  programData,
  teamTodayData,
  activityLogData
} from "../data/mockData";

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [medications, setMedications] = useState([]);
  const [schedule, setSchedule] = useState(null);
//  console.log(profile)
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        console.warn("No user found in localStorage.");
        return;
      }

      const user = JSON.parse(storedUser);
      const token = user?.token;

      if (!token) {
        console.warn("No token found in user object.");
        return;
      }

      const res = await axios.get(`${apiUrl}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data); // ← Triggers second useEffect
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  fetchProfile();
}, []);

useEffect(() => {
  const createPatientSchedule = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/meds_meals/create/${profile._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error creating schedule:', data.error);
      } else {
        // console.log('Schedule created:', data);
      }
    } catch (err) {
      console.error('Network error:', err.message);
    }
  };

  if (profile && profile._id) {
    createPatientSchedule();
  }
}, [profile]);


 useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/api/meds_meals/patient/${profile._id}/schedule`
        );
        if (!res.ok) throw new Error('Failed to fetch schedule');

        const data = await res.json();
        setSchedule(data);
      } catch (err) {
        console.error('Failed to fetch schedule:', err);
      }
    };

    if (profile?._id) {
      fetchSchedule();
    }
  }, [profile]);








  if (!profile) return <p>Loading...</p>;

  return (
    <div className="dashboard-app-container">
      <Sidebar navItems={navItems} profile={profile} />
      <div className="dashboard-main-content-area">
        <Header profile={profile} meds = {medications} />
        <main className="dashboard-main-content-section">
          <div className="dashboard-top-cards-grid">
            {topCardsData.map((card, index) => (
              <DashboardCard
  key={index}
  {...card}
  meds={
  ['medicines', 'meals'].includes(card.title.toLowerCase()) && schedule
    ? Object.entries(schedule).map(([day, data]) => ({
        day,
        medicines: data.medicines || [],
        meal: data.meal || {}
      }))
    : []
}
/>

            ))}
          </div>
          <div className="dashboard-middle-sections-grid">
            <ProgramSection data={programData} />
            <BillingSection />
            <TeamTodaySection data={teamTodayData} />
          </div>
          {/* <ActivityLogTable data={activityLogData} /> */}
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;