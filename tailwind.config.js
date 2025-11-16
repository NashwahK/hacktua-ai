/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",          // all pages/components in app
    "./app/components/**/*.{js,ts,jsx,tsx}" // all components
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
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      borderRadius: {
        glass: "2rem",
      },
      boxShadow: {
        glass: "0 4px 30px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
