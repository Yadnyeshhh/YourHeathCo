import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/patient-dashboard/DashboardLayout";
import DashboardHeader from "../../components/patient-dashboard/DashboardHeader";
import MealsSection from "../../components/patient-dashboard/MealsSection";
import AppointmentsSection from "../../components/patient-dashboard/AppointmentsSection";
import MedsSection from "../../components/patient-dashboard/MedsSection";
import DoctorsSection from "../../components/patient-dashboard/DoctorsSection";
import { getProfile } from "../../services/userService";
import { getSchedule } from "../../services/scheduleService";
import { getAppointments } from "../../services/appointmentService";
import { getAllDoctors } from "../../services/doctorService";

const weekDaysMap = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun"
};
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PatientDashboard() {
  const [profile, setProfile] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const profileRes = await getProfile();
        const userProfile = profileRes?.data || profileRes;
        setProfile(userProfile);

        if (userProfile && userProfile._id) {
          const [scheduleRes, apptsRes, docsRes] = await Promise.allSettled([
            getSchedule(userProfile._id),
            getAppointments(userProfile._id),
            getAllDoctors()
          ]);

          if (scheduleRes.status === 'fulfilled') setSchedule(scheduleRes.value?.data || scheduleRes.value);
          if (apptsRes.status === 'fulfilled') setAppointments(apptsRes.value?.data || apptsRes.value?.data?.data || []);
          
          let docs = [];
          if (docsRes.status === 'fulfilled') docs = docsRes.value?.data || docsRes.value?.data?.data || [];
          
          // Filter to only show consulting/assigned doctors for this patient
          if (userProfile.patientStatus) {
             const assignedDocId = userProfile.patientStatus.assignedDoctor?._id || userProfile.patientStatus.assignedDoctor;
             const consultingDocIds = (userProfile.patientStatus.consultingDoctors || []).map(d => d._id || d);
             docs = docs.filter(d => d._id === assignedDocId || consultingDocIds.includes(d._id));
          }
          setDoctorsList(docs);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-slate-50">
        <p className="text-slate-500 animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  // Parse schedule
  const mealsWeek = {};
  const medsWeek = {};
  weekDays.forEach(day => { mealsWeek[day] = []; medsWeek[day] = []; });
  
  if (schedule) {
    Object.entries(schedule).forEach(([dayName, dayData]) => {
      const shortDay = weekDaysMap[dayName.toLowerCase()];
      if (shortDay) {
        mealsWeek[shortDay] = dayData.meals || [];
        medsWeek[shortDay] = dayData.medicines || [];
      }
    });
  }

  // Get current day's data (mocking to Tuesday as per design for now, or use real day)
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const displayDay = weekDays.includes(currentDay) ? currentDay : 'Tue';
  const currentMeals = mealsWeek[displayDay] || [];
  const currentMeds = medsWeek[displayDay] || [];

  const nextAppt = appointments.length > 0 ? appointments[0] : null;
  // Format next appt for the UI
  const formattedNextAppointment = nextAppt ? {
    title: nextAppt.title || "Upcoming Appointment",
    doctor: {
      name: nextAppt.doctorName || "Doctor",
      role: nextAppt.doctorRole || "",
      img: nextAppt.doctorImg || "/profile.png"
    },
    date: new Date(nextAppt.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
    time: nextAppt.time || "TBD",
    location: nextAppt.location || "TBD",
    mode: nextAppt.mode || "In-person",
    countdown: "Upcoming",
  } : null;

  return (
    <DashboardLayout profile={profile}>
      <DashboardHeader profile={profile} />

      <div className="mt-6 grid grid-cols-12 gap-5">
        <MealsSection
          currentMeals={currentMeals}
          weekDays={weekDays}
          mealsWeek={mealsWeek}
        />
        {formattedNextAppointment ? (
           <AppointmentsSection nextAppointment={formattedNextAppointment} />
        ) : (
           <section className="col-span-12 animate-rise lg:col-span-5 flex items-center justify-center rounded-[22px] bg-deep p-6 text-white">
             <p className="text-white/70">No upcoming appointments</p>
           </section>
        )}
        <MedsSection currentMeds={currentMeds} />
        <DoctorsSection doctors={doctorsList.map(d => ({ ...d, img: d.img || "/profile.png" }))} />
      </div>
    </DashboardLayout>
  );
}
