/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',    // Indigo (blu-vjollcë e bukur)
        secondary: '#8B5CF6',  // Violet
        background: '#F3F4F6', // Gri shumë i lehtë
        textdark: '#1F2937',   // Gri e errët për tekste
        highlight: '#FBBF24',  // Ngjyrë e artë për hover
      },
    },
  },
  plugins: [],
}
