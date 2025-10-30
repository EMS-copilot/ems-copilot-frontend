/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1778FF",
        background: "#F7F7F7",
      },
      fontFamily: {
        sans: ["Pretendard", "ui-sans-serif", "system-ui", "Arial"],
      },
    },
  },
  plugins: [],
};
