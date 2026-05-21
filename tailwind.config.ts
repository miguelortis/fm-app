/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Mantenemos la ruta de lectura de HeroUI v3 para los componentes
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "unefm-blue": "#006ae1",
        "unefm-teal": "#00a6a0",
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      backgroundImage: {
        "corporate-gradient": "linear-gradient(to right, #006ae1, #00a6a0)",
        "corporate-gradient-tr":
          "linear-gradient(to top right, #006ae1, #00a6a0)",
      },
      keyframes: {
        // Corregido: Aseguramos los porcentajes como strings para evitar fallos de lectura
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "appearance-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        // Corregido: Ajustamos la sintaxis limpia de las transiciones
        "slide-in-left":
          "slide-in-left 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "fade-in": "fade-in 0.2s ease-out forwards",
        "appearance-in":
          "appearance-in 0.15s cubic-bezier(0, 0, 0.2, 1) forwards",
      },
      boxShadow: {
        "unefm-sm": "0 10px 30px -10px rgba(0, 106, 225, 0.05)",
        "unefm-md": "0 15px 40px -15px rgba(0, 106, 225, 0.08)",
        "unefm-lg": "0 20px 40px -10px rgba(0, 106, 225, 0.12)",
      },
    },
  },
  darkMode: "class",
  // Plugin de HeroUI removido por completo para la versión v3+
  plugins: [],
};

export default config;
