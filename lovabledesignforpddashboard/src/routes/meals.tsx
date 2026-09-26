import { createFileRoute } from "@tanstack/react-router";
import { TimetablePage } from "@/components/timetable-page";
import { mealsWeek } from "@/lib/health-data";

export const Route = createFileRoute("/meals")({
  head: () => ({
    meta: [
      { title: "Meals — YourHealthCo" },
      { name: "description", content: "Your weekly meal timetable and nutrition plan." },
      { property: "og:title", content: "Meals — YourHealthCo" },
      { property: "og:description", content: "Your weekly meal timetable and nutrition plan." },
    ],
  }),
  component: MealsPage,
});

function MealsPage() {
  return (
    <TimetablePage
      section="Section A"
      title="Meals timetable"
      subtitle="Your full weekly nutrition plan, day by day."
      data={mealsWeek}
    />
  );
}
