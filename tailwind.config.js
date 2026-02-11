
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Futura', '"Futura Std"', 'Jost', 'sans-serif'],
        eurostile: ['"Rheiborn Sans Clean"', 'Antonio', 'sans-serif'],
        oswald: ['"Rheiborn Sans Clean"', 'Antonio', 'sans-serif'],
        heading: ['"Rheiborn Sans Clean"', 'Antonio', 'sans-serif'],
      },
      fontWeight: {
        'light': '300',
        'normal': '300',
        'medium': '400',
        'semibold': '500',
        'bold': '500',
        'extrabold': '600',
        'black': '600', 
      },
      colors: {
        brand: {
          black: '#000000',
          dark: '#111111',
          gray: '#333333',
        }
      },
      keyframes: {
        'splash-fade-spin-out': {
          '0%': { transform: 'scale(0.9) rotate(0deg)', opacity: '0' },
          '25%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(0.9) rotate(720deg)', opacity: '0' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'fade-in-up': { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'scroll': { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: {
        'splash-fade-spin-out': 'splash-fade-spin-out 2s linear forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'scroll': 'scroll 25s linear infinite',
      },
    },
  },
  plugins: [],
}
