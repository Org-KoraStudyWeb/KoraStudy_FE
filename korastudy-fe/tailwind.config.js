/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#34bcf9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          400: '#7874d6',
          500: '#76d5e6',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        'custom': '150px',
      },
      boxShadow: {
        'custom': '0 20px 40px rgba(52, 188, 249, 0.3)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
