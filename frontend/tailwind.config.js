/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./product.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#19323C",
        accent: "#A93F55",
      },
    },
  },
  plugins: [],
}