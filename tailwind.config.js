/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#f3ece2',
        caramel: '#8b5e34',
        cocoa: '#3f2a1d',
        tan: '#c89f65'
      },
      boxShadow: {
        glow: '0 18px 40px rgba(139, 94, 52, 0.25)'
      }
    }
  },
  plugins: []
}
