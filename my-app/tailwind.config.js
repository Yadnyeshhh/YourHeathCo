/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Important for public/index.html if you use it
    "./src/**/*.{js,ts,jsx,tsx}", // This line is CRUCIAL for scanning your React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};