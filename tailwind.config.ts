import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#02060a",
        panel: "#071118",
        line: "#102832",
        matrix: "#c27aff",
        amber: "#f6b756",
        cyan: "#5eead4"
      },
      fontFamily: {
        display: ["var(--font-space)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"]
      },
      boxShadow: {
        glow: "0 0 36px rgba(194, 122, 255, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
