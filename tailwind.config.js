/** @type {import('tailwindcss').Config} */
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
      colors: {
        food: "#DC965A",
        mood: "#00CFC1",
        meds: "#773344",
        bowel: "#3C493F",
        button: "#077187",
        button_hover: "#2AD2F4",
        background: "#849A89",
      },
    },
  },
  plugins: [],
};
