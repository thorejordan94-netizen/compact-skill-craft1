import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1600px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        cyan: {
          DEFAULT: "hsl(var(--cyan))",
          400: "hsl(180 70% 55%)",
          500: "hsl(180 70% 50%)",
          600: "hsl(180 70% 40%)",
        },
        emerald: {
          DEFAULT: "hsl(var(--emerald))",
          400: "hsl(145 60% 50%)",
          500: "hsl(145 60% 45%)",
          600: "hsl(145 60% 35%)",
        },
        sky: {
          DEFAULT: "hsl(var(--sky))",
          400: "hsl(200 75% 55%)",
          500: "hsl(200 75% 50%)",
        },
        purple: {
          DEFAULT: "hsl(var(--purple))",
          400: "hsl(270 60% 60%)",
          500: "hsl(270 60% 55%)",
        },
        pink: {
          DEFAULT: "hsl(var(--pink))",
          400: "hsl(330 70% 60%)",
          500: "hsl(330 70% 55%)",
        },
        orange: {
          DEFAULT: "hsl(var(--orange))",
          400: "hsl(25 90% 60%)",
          500: "hsl(25 90% 55%)",
        },
        teal: {
          DEFAULT: "hsl(var(--teal))",
          400: "hsl(170 60% 45%)",
          500: "hsl(170 60% 40%)",
        },
        slate: {
          DEFAULT: "hsl(var(--slate))",
          400: "hsl(215 20% 55%)",
          500: "hsl(215 20% 50%)",
        },
        yellow: {
          DEFAULT: "hsl(var(--yellow))",
          400: "hsl(45 90% 60%)",
          500: "hsl(45 90% 55%)",
        },
        red: {
          400: "hsl(0 70% 55%)",
          500: "hsl(0 70% 50%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        'xs': '0.125rem',
        'sm': '0.25rem',
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
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 1.5s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.2s ease-out",
        "slide-in-left": "slide-in-left 0.2s ease-out",
        "fade-in": "fade-in 0.15s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
