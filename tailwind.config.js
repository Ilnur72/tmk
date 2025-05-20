/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,hbs}'],
  theme: {
    extend: {
      colors: {
        'tmk-blue': '#00a0c6',
        'tmk-dark-blue': '#006d87',
        'tmk-light-blue': '#33b5d6',
      },
    },
  },
  plugins: [],
};
