import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "xs": "320px",
        // => @media (min-width: 320px) { ... }

        "sm": "640px",
        // => @media (min-width: 640px) { ... }

        "md": "768px",
        // => @media (min-width: 768px) { ... }

        "lg": "1024px",
        // => @media (min-width: 1024px) { ... }

        "xl": "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
      },
    },
    extend: {
      fontSize: {
        base: "15px",
      },
      colors: {
        "black": "#06192F",
        "custom-blue": "#0469DE",
      },
      backgroundColor: {
        "custom-blue": "#0469DE",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  // eslint-disable-next-line ts/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
