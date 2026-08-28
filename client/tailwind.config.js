/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1b1f27',
        paper: '#f7f7f5',
        accent: {
          DEFAULT: '#3454d1',
          light: '#5c78e0',
          dark: '#26399a',
        },
        slateline: '#e2e4ea',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
