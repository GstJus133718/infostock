/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores personalizadas do InfoStock
        'blue-light': '#CDE7FF',
        'blue-dark': '#004685',
        'orange-custom': '#F88624',
        'gray-custom': '#F0F0F0',
        'red-custom': '#851F00',
        'green-custom': '#008543',
        
        // Sistema de cores principal
        primary: {
          50: '#f0f8ff',
          100: '#CDE7FF',
          200: '#b3d9ff',
          500: '#004685',
          600: '#003d75',
          700: '#003366',
        },
        
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#F88624',
          600: '#ea7c0d',
          700: '#c2610c',
        },
        
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#008543',
          600: '#007a3d',
          700: '#006f37',
        },
        
        warning: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#F88624',
          600: '#ea7c0d',
          700: '#c2610c',
        },
        
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#851F00',
          600: '#7a1c00',
          700: '#6f1900',
        },
        
        neutral: {
          50: '#f9f9f9',
          100: '#F0F0F0',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      }
    },
  },
  plugins: [],
}