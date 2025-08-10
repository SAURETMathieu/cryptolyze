import type { Config } from "tailwindcss";

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
    screens: {
      s: "425px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      minHeight: {
        main: "calc(100vh - var(--header-height))",
      },
      maxHeight: {
        main: "calc(100vh - var(--header-height))",
      },
      height: {
        header: "var(--header-height)",
        main: "calc(100vh - var(--header-height))",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        warmGray: {
          300: "#d1d5db",
          500: "#9ca3af",
          700: "#6b7280",
          900: "#374151",
        },
        coolGray: {
          300: "#dbeafe",
          500: "#64748b",
          700: "#334155",
          900: "#1e293b",
        },
        trueGray: {
          300: "#d1d5db",
          500: "#6b7280",
          700: "#4b5563",
          900: "#1f2937",
        },
        blueGray: {
          300: "#cbd5e1",
          500: "#4b5563",
          700: "#374151",
          900: "#1e293b",
        },
        olive: {
          300: "#b6e0b5",
          500: "#6f9c4e",
          700: "#4a7c30",
          900: "#2e5b20",
        },
        maroon: {
          100: "#f7d5d5",
          300: "#d2a1a1",
          500: "#a74c4c",
          700: "#7f2e2e",
          900: "#3e0f0f",
        },
        lavender: {
          300: "#d8b4fe",
          500: "#a47cbe",
          700: "#6b5b8c",
          900: "#4b3764",
        },
        turquoise: {
          100: "#e0f8f9",
          300: "#67e1e8",
          500: "#2bb5b9",
          700: "#0097a7",
          900: "#006d7e",
        },
        gold: {
          300: "#ffe15d",
          500: "#d1b33b",
          700: "#b79f2d",
          900: "#7f7c15",
        },
        platinum: {
          300: "#d2d6db",
          500: "#a3a8ac",
          700: "#9e9da0",
          900: "#7a7a7e",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        scaleUpDown: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        scaleBounce: "scaleUpDown 1s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
