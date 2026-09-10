/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: '#10262B',
        paper: '#F1EDE4',
        backwater: {
          DEFAULT: '#1F5C57',
          light: '#2E7A73',
          dark: '#153F3B',
        },
        monsoon: {
          DEFAULT: '#2B3A67',
          light: '#3D4F85',
        },
        marigold: {
          DEFAULT: '#E0A458',
          light: '#F0C48A',
          dark: '#B87F3A',
        },
        laterite: {
          DEFAULT: '#B23A2E',
          light: '#D45B4E',
        },
        leaf: {
          DEFAULT: '#2F8F5B',
          light: '#4FAF7A',
        },
        'paper-dim': '#E8E2D4',
      },
      fontFamily: {
        sans: ['Manrope'],
        medium: ['Manrope-Medium'],
        semibold: ['Manrope-SemiBold'],
        bold: ['Manrope-Bold'],
        extrabold: ['Manrope-ExtraBold'],
      },
      borderRadius: {
        sharp: '8px',
        soft: '16px',
      },
    },
  },
  plugins: [],
};
