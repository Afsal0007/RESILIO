/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'status-green': '#22c55e',
        'status-yellow': '#eab308',
        'status-red': '#ef4444',
        brand: '#0ea5e9',
      },
    },
  },
  plugins: [],
};
