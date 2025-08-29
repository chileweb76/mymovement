/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        food: "#DC965A",
        food_hover: "#EABF9A",
        mood: "#00CFC1",
        mood_hover: "#47FFF3",
        meds: "#773344",
        meds_hover: "#C27085",
        bowel: "#3C493F",
        bowel_hover: "#849A89",
        button: "#077187",
        button_hover: "#2AD2F4",
        background: "#849A89",
      },
      spacing: {
        header: "160px",
      },
    },
  },
  plugins: [],
};

export default config;