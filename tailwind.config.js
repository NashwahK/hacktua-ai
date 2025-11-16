// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "brand-1": "#336666",
        "brand-2": "#339999",
        "brand-3": "#99CCCC",
        "brand-4": "#336974",
        "brand-5": "#7BADE2",
        "brand-6": "#336699",
      },
      fontFamily: {
        london: ["Londoners", "serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        "glass": "2rem",
      },
      boxShadow: {
        "glass": "0 4px 30px rgba(0,0,0,0.1)",
      }
    },
  },
  plugins: [],
};
