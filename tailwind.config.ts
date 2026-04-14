import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        milkpink: "#F8C8DC",
        beige: "#F5E6D3",
        lavender: "#E6D6FF",
        softblack: "#333333",
        milkwhite: "#FFFFFF",
        "pink-light": "#FDE8F2",
        "pink-dark": "#F0A0C0",
        "beige-dark": "#E8D0B8",
        "lavender-dark": "#C8B0F0",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(248, 200, 220, 0.3)",
        "soft-lg": "0 8px 40px rgba(248, 200, 220, 0.4)",
        "soft-glow": "0 0 20px rgba(248, 200, 220, 0.5)",
        lavender: "0 4px 20px rgba(230, 214, 255, 0.4)",
        card: "0 2px 16px rgba(51, 51, 51, 0.06)",
        "card-hover": "0 8px 32px rgba(51, 51, 51, 0.12)",
      },
      animation: {
        "bounce-soft": "bounceSoft 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "float-slow": "float 5s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      backgroundImage: {
        "pink-gradient": "linear-gradient(135deg, #F8C8DC 0%, #F5E6D3 50%, #E6D6FF 100%)",
        "hero-gradient": "linear-gradient(135deg, #FDE8F2 0%, #F8C8DC 40%, #E6D6FF 100%)",
        "card-gradient": "linear-gradient(180deg, #FFFFFF 0%, #FDE8F2 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
