/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'grad-start': '#F5A623',
        'grad-mid': '#E8304A',
        'grad-end': '#D81BCD',
        'blue-royal': '#1A3F9E',
        'blue-light': '#3A6FD8',
        'yellow-accent': '#F5C800',
        'red-accent': '#CC2020',
        'bg-dark': '#0A0A12',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
