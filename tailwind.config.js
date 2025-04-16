/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "profile-purple": "#9E7AFF",
        "profile-pink": "#FE8BBB",
        "profile-blue": "#3B82F6",
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
      backgroundImage: {
        "gradient-profile": "linear-gradient(135deg, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
