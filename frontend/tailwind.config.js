/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#18212f",
        ocean: "#1e5f74",
        mint: "#58b09c",
        coral: "#f26a4f",
      },
      boxShadow: {
        panel: "0 18px 50px rgba(24, 33, 47, 0.10)",
      },
    },
  },
  plugins: [],
};
