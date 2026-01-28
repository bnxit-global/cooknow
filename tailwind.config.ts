import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        background: "#05070A",
        surface: "#0A0C10",
        gold: {
          DEFAULT: "#D4AF37",
          soft: "rgba(212, 175, 55, 0.4)",
          glow: "#F9E5BC",
        },
        primary: {
          DEFAULT: "#D4AF37",
          glow: "#F9E5BC",
        },
        accent: {
          DEFAULT: "#D4AF37",
          glow: "#F9E5BC",
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': "linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)",
        'chef-gradient': 'linear-gradient(to bottom, rgba(5, 7, 10, 0) 0%, rgba(5, 7, 10, 0.9) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
