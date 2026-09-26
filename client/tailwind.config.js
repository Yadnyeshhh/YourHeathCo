/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jade: "#10b981",
        deep: "#0f172a",
        ink: "#0f172a",
      },
      keyframes: {
        rise: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        rise: 'rise 0.5s cubic-bezier(0.32, 0.72, 0, 1) both',
      }
    },
  },
  plugins: [],
};