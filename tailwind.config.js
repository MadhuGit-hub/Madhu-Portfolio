/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        violet: "#7C3AED",
        cyan: "#06B6D4",
        pink: "#EC4899",
        white: "#F8FAFC",
        muted: "#94A3B8",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dmsans: ["DM Sans", "sans-serif"],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
