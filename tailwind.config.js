/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['PT Serif', 'serif'],
        lora: ['Lora', 'serif'],
        parisienne: ['Parisienne', 'cursive'],
        fraunces: ['Fraunces', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
        surana: ['Suranna', 'serif'],
        abril: ['Abril Fatface', 'serif'],
        opensans: ['Open Sans', 'sans-serif'],
        libre: ['Libre Baskerville', 'serif'],
        elsie: ['Elsie', 'serif'],
        carattere: ['Carattere', 'cursive'],
        ivyora: ['ivyora-display', 'sefir'],


      },
      colors: {
        primary: {
          DEFAULT: '#f43f5c',  // rojo principal
          dark: '#e11d48',     // rojo oscuro
          contrast: '#FFFFFF'  // Contraste para texto sobre el color primario
        }
      },
    },
  },
  plugins: [],
};