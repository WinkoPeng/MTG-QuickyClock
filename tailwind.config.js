/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/preline/preline.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0185BE",
        main: "#0474b3",
        light: "#D6F1FF",
        lighter: "#EBF7FF",
        dark: "#021A27",
      },
    },
  },
  plugins: [require("preline/plugin")],
};
