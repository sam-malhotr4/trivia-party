/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#E11D48', // Red for buttons and accents
        secondary: '#1E293B', // Dark gray for backgrounds
        accent: '#FACC15', // Yellow for highlights
        muted: '#64748B', // Muted text
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

