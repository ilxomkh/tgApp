/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tg-primary': '#0088CC',
        'tg-secondary': '#F0F0F0',
        'tg-success': '#4CAF50',
        'tg-warning': '#FF9800',
        'tg-error': '#F44336',
      },
      fontFamily: {
        'tg': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      screens: {
        'xs': '375px',
        'sm': '414px',
        'md': '768px',
      }
    },
  },
  plugins: [],
}
