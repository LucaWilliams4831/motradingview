/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        'body': 'calc(100vh-24rem)'
      }
    },
  },
  plugins: [],
}

