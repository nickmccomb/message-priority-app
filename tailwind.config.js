/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Message priority colors
        urgent: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
          dark: '#991b1b',
        },
        high: {
          DEFAULT: '#f97316',
          light: '#ffedd5',
          dark: '#9a3412',
        },
        normal: {
          DEFAULT: '#22c55e',
          light: '#dcfce7',
          dark: '#166534',
        },
        // Source colors
        slack: {
          DEFAULT: '#4a154b',
          light: '#f3e8ff',
        },
        email: {
          DEFAULT: '#2563eb',
          light: '#dbeafe',
        },
        whatsapp: {
          DEFAULT: '#25d366',
          light: '#dcfce7',
        },
        linkedin: {
          DEFAULT: '#0077b5',
          light: '#e0f2fe',
        },
      },
    },
  },
  plugins: [],
};

