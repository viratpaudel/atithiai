/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"],
      },
      colors: {
        // "Himalayan sunrise" palette (light values; dark handled via CSS vars)
        brand: {
          50: "#EEF7F6",
          100: "#D6EEEC",
          200: "#A9DCD8",
          300: "#6FC2BC",
          400: "#2FA69B",
          500: "#12877E",
          600: "#0E6B65",
          700: "#0C5450",
          800: "#0B3F3D",
          900: "#0A2E2D",
          950: "#06201F",
        },
        saffron: {
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#B45309", // AA-safe on light surfaces
        },
        coral: {
          300: "#FFA79A",
          400: "#FF8A7A",
          500: "#F46253",
          600: "#C93A2E",
        },
        // Semantic tokens mapped to CSS variables for theme switching
        surface: "rgb(var(--bg) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        ink: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--text-muted) / <alpha-value>)",
        line: "rgb(var(--border) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      boxShadow: {
        card: "0 4px 16px rgba(6,42,40,0.08), 0 1px 3px rgba(6,42,40,0.05)",
        lift: "0 18px 36px rgba(6,42,40,0.18)",
        glow: "0 8px 24px rgba(245,158,11,0.35)",
        navpill: "0 -2px 24px rgba(6,42,40,0.10), 0 10px 30px rgba(6,42,40,0.14)",
      },
      backgroundImage: {
        hero: "linear-gradient(135deg, #0B3F3D 0%, #1E3A5F 55%, #312E5E 100%)",
        "hero-aurora":
          "radial-gradient(ellipse 80% 55% at 85% 8%, rgba(251,191,36,0.35), transparent 60%), radial-gradient(ellipse 60% 45% at 8% 92%, rgba(244,98,83,0.22), transparent 60%)",
        "primary-btn": "linear-gradient(135deg, #F59E0B 0%, #F46253 100%)",
        "brand-panel": "linear-gradient(135deg, #0B3F3D 0%, #1E3A5F 100%)",
      },
    },
  },
  plugins: [],
};
