import { createFileRoute } from "@tanstack/react-router";
import { TimetablePage } from "@/components/timetable-page";
import { medsWeek } from "@/lib/health-data";

export const Route = createFileRoute("/meds")({
  head: () => ({
    meta: [
      { title: "Meds — YourHealthCo" },
      { name: "description", content: "Your weekly medication schedule and dosing reminders." },
      { property: "og:title", content: "Meds — YourHealthCo" },
      { property: "og:description", content: "Your weekly medication schedule and dosing reminders." },
    ],
  }),
  component: MedsPage,
});

function MedsPage() {
  return (
    <TimetablePage
      section="Section B"
      title="Meds timetable"
      subtitle="Your full weekly prescription schedule, day by day."
      data={medsWeek}
    />
  );
}
