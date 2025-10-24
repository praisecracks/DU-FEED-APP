/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xxs: "300px",
        xs: "460px",
        xd: "960px",
      },

      colors: {
        neon: {
          blue: "#00E5FF",
          purple: "#7C4DFF",
          pink: "#FF6EC7",
          green: "#00FF9E",
          yellow: "#F9F871",
        },
      },

      boxShadow: {
        glow: "0 0 20px rgba(124,77,255,0.18)",
        "neon-blue": "0 0 14px rgba(0,229,255,0.18)",
      },

      backgroundImage: {
        "gradient-glow": "linear-gradient(135deg, rgba(124,77,255,0.12), rgba(0,229,255,0.08))",
      },

      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },

      animation: {
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
