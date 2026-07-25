/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // ── Brand Color System ────────────────────────────────────────────────
      colors: {
        primary: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        // CiviLink specific palette
        "cl-blue":     "#2563eb",
        "cl-blue-dark":"#1d4ed8",
        "cl-navy":     "#0f1f3d",
        "cl-indigo":   "#6366f1",
        "cl-sky":      "#0ea5e9",
        "cl-success":  "#10b981",
        "cl-warning":  "#f59e0b",
        "cl-error":    "#ef4444",

        // Backgrounds
        "bg-base":    "#f0f4ff",
        "bg-card":    "#ffffff",
        "bg-sidebar": "#f8faff",
        "bg-input":   "#f5f7ff",

        // Text
        "text-primary":   "#0f1f3d",
        "text-secondary": "#475569",
        "text-muted":     "#94a3b8",

        // Border
        "border-base": "#e2e8f0",

        // Legacy M3 tokens (kept for backward compat)
        "cl-primary":  "#2563eb",
        "cl-tertiary": "#6366f1",
        outline:       "#94a3b8",
        "on-surface":  "#0f1f3d",
        "cl-surface":  "#f0f4ff",
        "on-background": "#0f1f3d",
        "surface-container-low": "#eff6ff",
        "surface-container":     "#dbeafe",
        "outline-variant":       "#e2e8f0",
      },

      // ── Spacing ────────────────────────────────────────────────────────────
      spacing: {
        xs:   "4px",
        sm:   "8px",
        md:   "16px",
        lg:   "24px",
        xl:   "32px",
        "2xl": "48px",
        "3xl": "64px",
        gutter: "24px",
        "container-max": "1280px",
      },

      // ── Border Radius ─────────────────────────────────────────────────────
      borderRadius: {
        DEFAULT: "0.375rem",
        sm:   "6px",
        md:   "10px",
        lg:   "12px",
        xl:   "16px",
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "32px",
        full: "9999px",
      },

      // ── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.025em", fontWeight: "800" }],
        "display-md": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em",  fontWeight: "700" }],
        "display-sm": ["32px", { lineHeight: "40px", letterSpacing: "-0.015em", fontWeight: "700" }],
        "headline-lg": ["28px", { lineHeight: "36px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "title-lg": ["18px", { lineHeight: "28px", fontWeight: "600" }],
        "title-md": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "title-sm": ["14px", { lineHeight: "20px", fontWeight: "600" }],
        "body-lg":  ["16px", { lineHeight: "26px", fontWeight: "400" }],
        "body-md":  ["14px", { lineHeight: "22px", fontWeight: "400" }],
        "body-sm":  ["13px", { lineHeight: "20px", fontWeight: "400" }],
        "label-lg": ["13px", { lineHeight: "18px", letterSpacing: "0.01em",  fontWeight: "500" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.015em", fontWeight: "600" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.04em",  fontWeight: "700" }],
      },

      // ── Box Shadow ────────────────────────────────────────────────────────
      boxShadow: {
        sm:    "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        md:    "0 4px 16px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        lg:    "0 10px 40px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)",
        xl:    "0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)",
        blue:  "0 8px 32px rgba(37,99,235,0.30)",
        "blue-sm": "0 4px 16px rgba(37,99,235,0.20)",
        card:  "0 2px 12px rgba(15,31,61,0.06)",
        "card-hover": "0 8px 32px rgba(15,31,61,0.10)",
        inset: "inset 0 2px 8px rgba(0,0,0,0.06)",
      },

      // ── Animations ────────────────────────────────────────────────────────
      animation: {
        "fade-in":        "fadeIn 0.3s ease-in-out",
        "fade-in-up":     "fadeInUp 0.4s ease-out",
        "fade-in-down":   "fadeInDown 0.4s ease-out",
        "slide-up":       "slideUp 0.3s ease-out",
        "scale-in":       "scaleIn 0.25s ease-out",
        "shimmer":        "shimmer 3s infinite linear",
        "skeleton-pulse": "skeletonPulse 1.5s infinite",
        "spin":           "spin 1s linear infinite",
        "pulse-glow":     "pulse-glow 2s infinite",
        "slide-in-toast": "slideInFromBottom 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn:             { "0%": { opacity: "0" },                                          "100%": { opacity: "1" } },
        fadeInUp:           { "0%": { opacity: "0", transform: "translateY(16px)" },           "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeInDown:         { "0%": { opacity: "0", transform: "translateY(-16px)" },          "100%": { opacity: "1", transform: "translateY(0)" } },
        slideUp:            { "0%": { opacity: "0", transform: "translateY(10px)" },           "100%": { opacity: "1", transform: "translateY(0)" } },
        scaleIn:            { "0%": { opacity: "0", transform: "scale(0.95)" },                "100%": { opacity: "1", transform: "scale(1)" } },
        shimmer:            { "0%": { backgroundPosition: "200% 0" },                          "100%": { backgroundPosition: "-200% 0" } },
        skeletonPulse:      { "0%": { backgroundPosition: "200% 0" },                          "100%": { backgroundPosition: "-200% 0" } },
        slideInFromBottom:  { "0%": { transform: "translateY(200%)", opacity: "0" },           "100%": { transform: "translateY(0)", opacity: "1" } },
        "pulse-glow":       { "0%, 100%": { boxShadow: "0 0 0 0 rgba(37,99,235,0.4)" },       "50%": { boxShadow: "0 0 0 12px rgba(37,99,235,0)" } },
      },

      // ── Backdrop Blur ─────────────────────────────────────────────────────
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
    },
  },
  plugins: [],
};
