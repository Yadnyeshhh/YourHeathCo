import React, { useState, useEffect } from "react";
import { TimetablePage } from "../../components/patient-dashboard/TimetablePage";
import { getProfile } from "../../services/userService";
import { getSchedule } from "../../services/scheduleService";

const weekDaysMap = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed",
  thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun"
};
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Meds() {
  const [medsWeek, setMedsWeek] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        setLoading(true);
        const profileRes = await getProfile();
        const profile = profileRes?.data || profileRes;
        
        const scheduleRes = await getSchedule(profile._id);
        const schedule = scheduleRes?.data || scheduleRes;
        
        const parsedMeds = {};
        weekDays.forEach(d => parsedMeds[d] = []);
        if (schedule) {
          Object.entries(schedule).forEach(([dayName, dayData]) => {
            const shortDay = weekDaysMap[dayName.toLowerCase()];
            if (shortDay && dayData.medicines) {
              parsedMeds[shortDay] = dayData.medicines;
            }
          });
        }
        setMedsWeek(parsedMeds);
      } catch (err) {
        console.error("Failed to load meds:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeds();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <p className="text-slate-500 animate-pulse">Loading Meds...</p>
      </div>
    );
  }

  return (
    <TimetablePage
      section="Section B"
      title="Meds timetable"
      subtitle="Your full weekly prescription schedule, day by day."
      data={medsWeek}
    />
  );
}
