/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'righteous': ['Righteous', 'cursive'],
      },
      colors: {
        cosmic: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      backgroundImage: {
        'cosmic-light': 'linear-gradient(to right, #e2e8f0, #f8fafc)',
        'cosmic-dark': 'linear-gradient(to right, #1e293b, #0f172a)',
        'cosmic-gradient': 'linear-gradient(45deg, #8b5cf6, #3b82f6, #06b6d4)',
      },
    },
  },
  plugins: [],
};