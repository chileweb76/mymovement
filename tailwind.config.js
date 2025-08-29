/** @type {import('tailwindcss').Config} */
<<<<<<< HEAD
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
      },
=======
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
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
<<<<<<< HEAD
=======
      spacing: {
        header: "160px",
      },
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
    },
  },
  plugins: [],
};
<<<<<<< HEAD
=======

export default config;
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
