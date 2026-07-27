/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F5F9FA",
        surface: "#FFFFFF",
        surface2: "#EAF3F4",
        border: "#DCE6E8",
        accent: "#00A3BF",
        accent2: "#FF5A5F",
        ink: "#0F2224",
        muted: "#5B6C6F",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "diagonal-stripes":
          "repeating-linear-gradient(-45deg, rgba(0,163,191,0.06) 0px, rgba(0,163,191,0.06) 2px, transparent 2px, transparent 14px)",
      },
    },
  },
  plugins: [],
};
