/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        accent: "#4a90e2",
        dark: "#0f172a",
        light: "#f8fafc"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: [],
};