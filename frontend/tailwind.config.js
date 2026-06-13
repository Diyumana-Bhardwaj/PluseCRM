/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#FF6B35",
        "brand-hover": "#E55A26",
        bg:      "#13151A",
        surface: "#1C1F27",
        card:    "#1A1D24",
        border:  "#2D3139",
        muted:   "#6B7280",
        subtle:  "#4B5563",
        dim:     "#9CA3AF",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
