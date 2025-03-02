import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-in",
        "fade-in-slow": "fadeIn 2s ease-in",
      },
      // that is actual animation
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "100",
          },
        },
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
} satisfies Config;
