import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      //this?
      fontFamily: {
        //sans: ['Inter', 'sans-serif'],
        serif: ["Merriweather", "serif"],
        mono: ["Menlo", "monospace"],
        sans: ["SpoqaHanSansNeo", "NatoSansKR", "sans-serif"],
      },
      //let's see
    },
  },
  plugins: [],
};
export default config;
