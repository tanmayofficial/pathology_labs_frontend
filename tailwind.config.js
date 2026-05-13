/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,css}", "./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#007bff",
        secondary: "#6c757d",
        background: "#1a1a2e",
        accent: "#ff007f",
        gray: {
          700: "#2d2d2d",
          600: "#3b3b3b",
        },
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};



