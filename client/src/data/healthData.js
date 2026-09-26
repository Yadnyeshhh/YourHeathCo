const DEFAULT_IMAGE = "/profile.png";

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const doctors = [
  {
    name: "Dr. Lena Park",
    role: "Clinical Nutritionist",
    tag: "Primary",
    img: DEFAULT_IMAGE,
  },
  {
    name: "Dr. Marcus Feld",
    role: "Endocrinologist",
    tag: "Referral",
    img: DEFAULT_IMAGE,
  },
  {
    name: "Dr. Iris Chen",
    role: "Cardiologist",
    tag: "Monitoring",
    img: DEFAULT_IMAGE,
  },
];

export const nextAppointment = {
  title: "Nutrition follow-up",
  doctor: doctors[0],
  date: "Thu 16 May",
  time: "09:30",
  location: "Room 204",
  mode: "Telehealth",
  countdown: "In 2 days",
};

export const mealsWeek = {
  Mon: [
    { label: "Oat & berry bowl", time: "07:30", done: true },
    { label: "Grilled salmon plate", time: "12:30", done: true },
    { label: "Lentil & quinoa bowl", time: "18:00", done: true },
    { label: "Herbal tea", time: "21:00", done: true },
  ],
  Tue: [
    { label: "Greek yogurt & nuts", time: "07:30", done: true },
    { label: "Chicken & avocado wrap", time: "12:30", done: true },
    { label: "Vegetable stir-fry", time: "18:00", done: true },
    { label: "Herbal tea", time: "21:00", done: true },
  ],
  Wed: [
    { label: "Oat & berry bowl", time: "07:30", done: true },
    { label: "Turkey & rice bowl", time: "12:30", done: true },
    { label: "Baked cod & greens", time: "18:00", done: false },
  ],
  Thu: [
    { label: "Smoothie & toast", time: "07:30", done: false },
    { label: "Grilled salmon plate", time: "12:30", done: false },
    { label: "Lentil soup", time: "18:00", done: false },
  ],
  Fri: [
    { label: "Greek yogurt & nuts", time: "07:30", done: false },
    { label: "Chicken salad", time: "12:30", done: false },
  ],
  Sat: [
    { label: "Pancakes & fruit", time: "08:30", done: false },
    { label: "Roast vegetables", time: "13:00", done: false },
  ],
  Sun: [
    { label: "Oat & berry bowl", time: "08:30", done: false },
    { label: "Family lunch plate", time: "13:00", done: false },
  ],
};

export const medsWeek = {
  Mon: [
    { label: "Metformin 500mg", time: "08:00", done: true },
    { label: "Vitamin D3", time: "12:00", done: true },
    { label: "Metformin 500mg", time: "20:00", done: true },
  ],
  Tue: [
    { label: "Metformin 500mg", time: "08:00", done: true },
    { label: "Vitamin D3", time: "12:00", done: true },
    { label: "Metformin 500mg", time: "20:00", done: true },
  ],
  Wed: [
    { label: "Metformin 500mg", time: "08:00", done: true },
    { label: "Vitamin D3", time: "12:00", done: false },
    { label: "Metformin 500mg", time: "20:00", done: false },
  ],
  Thu: [
    { label: "Metformin 500mg", time: "08:00", done: false },
    { label: "Vitamin D3", time: "12:00", done: false },
    { label: "Metformin 500mg", time: "20:00", done: false },
  ],
  Fri: [
    { label: "Metformin 500mg", time: "08:00", done: false },
    { label: "Vitamin D3", time: "12:00", done: false },
    { label: "Metformin 500mg", time: "20:00", done: false },
  ],
  Sat: [
    { label: "Metformin 500mg", time: "08:00", done: false },
    { label: "Vitamin D3", time: "12:00", done: false },
  ],
  Sun: [
    { label: "Metformin 500mg", time: "08:00", done: false },
    { label: "Vitamin D3", time: "12:00", done: false },
  ],
};
