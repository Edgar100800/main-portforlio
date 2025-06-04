/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "profile-purple": "#9E7AFF",
        "profile-pink": "#FE8BBB",
        "profile-blue": "#3B82F6",
        // Colores del tema NOOdle
        "noodle-orange": "#FF6B2B",
        "noodle-orange-light": "#FF8550",
        "noodle-orange-dark": "#E55A26",
        "noodle-red": "#FF4500",
        "noodle-red-light": "#FF6347",
        "noodle-red-dark": "#DC3F00",
        "noodle-cream": "#FFF8F0",
        "noodle-beige": "#F5F0E8",
        "noodle-brown": "#8B4513",
        "noodle-brown-light": "#A0522D",
        // Definir tonalidades explícitamente para Tailwind v4
        indigo: {
          950: "#1e1b4b",
          900: "#312e81",
          800: "#3730a3",
          700: "#4338ca",
          600: "#4f46e5",
        },
        blue: {
          600: "#2563eb",
          500: "#3b82f6",
          400: "#60a5fa",
        },
      },
      fontFamily: {
        'pramukh': ['PramukhRounded-Variable', 'PramukhRounded-Regular', 'sans-serif'],
        'pramukh-light': ['PramukhRounded-Light', 'sans-serif'],
        'pramukh-regular': ['PramukhRounded-Regular', 'sans-serif'],
        'pramukh-semibold': ['PramukhRounded-Semibold', 'sans-serif'],
        'pramukh-bold': ['PramukhRounded-Bold', 'sans-serif'],
        'pramukh-extrabold': ['PramukhRounded-Extrabold', 'sans-serif'],
        'pramukh-black': ['PramukhRounded-Black', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-profile": "linear-gradient(135deg, var(--tw-gradient-stops))",
        "gradient-noodle": "linear-gradient(135deg, #FF6B2B 0%, #FF4500 100%)",
        "gradient-noodle-light": "linear-gradient(135deg, #FF8550 0%, #FF6347 100%)",
      },
      fontSize: {
        'noodle-hero': ['4rem', { lineHeight: '1', fontWeight: '900' }],
        'noodle-title': ['2.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'noodle-subtitle': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
      },

      keyframes: {
        // Define el keyframe para el desplazamiento hacia la izquierda
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          // Traslada el contenedor un 50% de su propio ancho.
          // Como el contenedor tendrá 2 copias del contenido (100% + 100%),
          // trasladar el 50% del contenedor es trasladar el 100% de una copia.
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        // Define una utilidad de animación 'scroll' que usa el keyframe y se repite infinitamente
        scroll: 'scroll-left 20s linear infinite', // Ajusta '20s' para controlar la velocidad
      },
    },
  },
  plugins: [],
};
