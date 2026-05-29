/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#C9A84C",
        "gold-light": "#E8C96D",
        "gold-dark": "#9A7A2E",
        emerald: "#1A6B4A",
        "emerald-light": "#22A06B",
        noir: "#0A0A0A",
        dark: "#111111",
        "dark-card": "#161616",
        "dark-border": "#2A2A2A",
        muted: "#888888",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        sans: ["Josefin Sans", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        shimmer: "shimmer 3s infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

