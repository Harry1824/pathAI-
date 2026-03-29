/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b0c10',
        panel: 'rgba(31, 40, 51, 0.8)',
        cyan: '#66fcf1',
        teal: '#45a29e',
        textMain: '#c5c6c7',
        textLight: '#ffffff',
      }
    },
  },
  plugins: [],
}
