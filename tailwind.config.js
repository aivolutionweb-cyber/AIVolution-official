/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF3B00", // Electric Orange
        dark: "#09090b", // Absolute Dark
        surface: "#18181b", // Elevated Dark
        muted: "#A1A1AA", // Zinc
        gridline: "#27272a", // Subtle dark grey for grid
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
       backgroundImage: {
        'banner-gradient': 'linear-gradient(to right, rgba(9,9,11,0.9), rgba(9,9,11,0.3))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}