/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'editor-bg': '#1e1e1e',
        'sidebar-bg': '#252526',
        'border-color': '#3e3e42'
      }
    },
  },
  plugins: [],
}