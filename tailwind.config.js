/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      screens: {
        xxs: "300px",
        xs: "460px",
        xd: "960px",
      },
    },
  },
  plugins: [],
}
