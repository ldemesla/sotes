import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsla(var(--foreground), 0.92)",
        layout: {
          DEFAULT: "hsl(var(--layout))",
          foreground: "hsl(var(--layout-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsla(var(--card-foreground), 0.92)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        brand: {
          DEFAULT: "hsl(var(--brand))",
          foreground: "var(--brand-foreground)",
        },
        primary: {
          DEFAULT: "hsla(var(--primary), 0.05)",
          foreground: "hsla(var(--primary-foreground), 0.92)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        section: "0px 0px 3px 0px rgba(0,0,0,0.25)",
        item: "0px 0.5px 2.5px 0px rgba(0, 0, 0, 0.30)",
        "item-hover":
          "0px 0px 1px 0px rgba(0, 0, 0, 0.40), 0px 0px 1.5px 0px rgba(0, 0, 0, 0.30), 0px 7px 22px 0px rgba(0, 0, 0, 0.25)",
        window: "0px 36px 100px 0px rgba(0, 0, 0, 0.40), 0px 0px 3px 0px rgba(0, 0, 0, 0.25)",
      },
      fontFamily: {
        serif: ["New York Extra Large", "serif"],
        sans: ["SF Pro Text", "Geist", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
