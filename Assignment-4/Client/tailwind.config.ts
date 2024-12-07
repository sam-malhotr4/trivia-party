/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff4747', // Matches your button and logo color
        secondary: '#1a1a1a', // Background color
        textPrimary: '#fff', // Main text color
        cardBg: '#333', // Card and navbar background
      },
    },
  },
  plugins: [],
};
