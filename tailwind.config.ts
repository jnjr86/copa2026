import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#23FDA6",
        "accent-dim": "rgba(35,253,166,0.12)",
        "accent-glow": "rgba(35,253,166,0.25)",
        surface: {
          base: "#0C0E15",
          card: "#131620",
          hover: "#181B28",
          border: "#1E2233",
          muted: "#1A1F2E",
        },
        content: {
          primary: "#E8EAF0",
          secondary: "#8892A4",
          muted: "#4A5568",
        },
        phase: {
          grupo: "#4F9CF9",
          "16avos": "#C084FC",
          oitavas: "#818CF8",
          quartas: "#FB923C",
          semi: "#F87171",
          terce: "#94A3B8",
          final: "#FCD34D",
        },
      },
      fontFamily: {
        display: ["Clash Grotesk", "system-ui", "sans-serif"],
        body: ["Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.5)",
        accent: "0 0 20px rgba(35,253,166,0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
