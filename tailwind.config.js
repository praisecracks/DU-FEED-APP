/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xxs: "300px",
        // => @media (min-width: 400px) { ... }
        xs: "460px",
        // => @media (min-width: 400px) { ... }
        // => @media (min-width: 640px) { ... }
        xd: "960px",
        // => @media (min-width: 960px) { ... }
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
  plugins: [],
}