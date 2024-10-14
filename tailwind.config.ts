import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        yekanBakh: ["var(--font-yekanBakh-regular)", "serif"],
        lobester: ["var(--font-lobester)", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          100: "#E6FFF6",
          200: "#C8FFEB",
          300: "#90FFD6",
          400: "#48FDBC",
          500: "var(--primary)",
          600: "#00D889",
          700: "#2b6cb0",
          800: "#008554",
          900: "#004028",
        },
        secondary: "var(--secondary)",
      },
    },
  },
  plugins: [],
};
export default config;
