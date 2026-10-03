/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F7F1E7",
        charcoal: {
          DEFAULT: "#3E3A34",
          light: "#5A554D",
          muted: "#767066",
        },
        botanical: {
          DEFAULT: "#556B52",
          dark: "#2E3D2D",
          light: "#788F75",
          soft: "#E8EFE7",
        },
        gold: {
          DEFAULT: "#B9975B",
          dark: "#96753C",
          light: "#D8C296",
          soft: "#F8F4EB",
        },
        cream: {
          DEFAULT: "#FAF7F2",
          card: "#FFFFFF",
          border: "#E8E0D5",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(62, 58, 52, 0.08)",
        "luxury-hover": "0 20px 40px -15px rgba(62, 58, 52, 0.14)",
      },
    },
  },
  plugins: [],
};