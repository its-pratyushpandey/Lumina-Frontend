/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          foreground: '#FFFFFF',
        },
        background: {
          DEFAULT: '#FFFFFF',
          subtle: '#F9FAFB',
        },
        border: {
          DEFAULT: '#E5E7EB',
          subtle: '#F3F4F6',
        },
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};