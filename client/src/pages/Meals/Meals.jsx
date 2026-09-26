import React, { useState, useEffect } from "react";
import { TimetablePage } from "../../components/patient-dashboard/TimetablePage";
import { getProfile } from "../../services/userService";
import { getSchedule } from "../../services/scheduleService";

const weekDaysMap = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed",
  thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun"
};
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Meals() {
  const [mealsWeek, setMealsWeek] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const profileRes = await getProfile();
        const profile = profileRes?.data || profileRes;
        
        const scheduleRes = await getSchedule(profile._id);
        const schedule = scheduleRes?.data || scheduleRes;
        
        const parsedMeals = {};
        weekDays.forEach(d => parsedMeals[d] = []);
        if (schedule) {
          Object.entries(schedule).forEach(([dayName, dayData]) => {
            const shortDay = weekDaysMap[dayName.toLowerCase()];
            if (shortDay && dayData.meals) {
              parsedMeals[shortDay] = dayData.meals;
            }
          });
        }
        setMealsWeek(parsedMeals);
      } catch (err) {
        console.error("Failed to load meals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <p className="text-slate-500 animate-pulse">Loading Meals...</p>
      </div>
    );
  }

  return (
    <TimetablePage
      section="Section A"
      title="Meals timetable"
      subtitle="Your full weekly nutrition plan, day by day."
      data={mealsWeek}
    />
  );
}
