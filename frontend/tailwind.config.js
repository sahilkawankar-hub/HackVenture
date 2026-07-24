/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // ── Existing primary scale kept intact ──────────────────────────────
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        surface: "#1e1b4b",
        background: "#0f0e26",

        // ── M3 Design Tokens (Stitch / CiviLink palette) ─────────────────
        "surface-tint": "#0053db",
        "on-tertiary-fixed-variant": "#2f2ebe",
        "surface-dim": "#cbdbf5",
        "primary-container": "#2563eb",
        "cl-primary": "#004ac6",
        outline: "#737686",
        "on-secondary-fixed": "#002113",
        "on-surface": "#0b1c30",
        "cl-surface": "#f8f9ff",
        "on-primary-container": "#eeefff",
        "on-background": "#0b1c30",
        "tertiary-fixed-dim": "#c0c1ff",
        "surface-bright": "#f8f9ff",
        "surface-container-high": "#dce9ff",
        "error-container": "#ffdad6",
        "secondary-container": "#6cf8bb",
        "surface-container-lowest": "#ffffff",
        "tertiary-fixed": "#e1e0ff",
        "primary-fixed": "#dbe1ff",
        "on-secondary-fixed-variant": "#005236",
        "on-primary": "#ffffff",
        "tertiary-container": "#585be6",
        "on-tertiary": "#ffffff",
        "inverse-surface": "#213145",
        "on-tertiary-container": "#f1eeff",
        "on-primary-fixed": "#00174b",
        "secondary-fixed": "#6ffbbe",
        "cl-secondary": "#006c49",
        "on-primary-fixed-variant": "#003ea8",
        "primary-fixed-dim": "#b4c5ff",
        "cl-background": "#f8f9ff",
        "on-error": "#ffffff",
        "inverse-primary": "#b4c5ff",
        "inverse-on-surface": "#eaf1ff",
        "on-error-container": "#93000a",
        "cl-tertiary": "#3e3fcc",
        "secondary-fixed-dim": "#4edea3",
        "on-surface-variant": "#434655",
        "on-tertiary-fixed": "#07006c",
        "on-secondary-container": "#00714d",
        "surface-container-low": "#eff4ff",
        "on-secondary": "#ffffff",
        "cl-error": "#ba1a1a",
        "surface-container": "#e5eeff",
        "surface-container-highest": "#d3e4fe",
        "surface-variant": "#d3e4fe",
        "outline-variant": "#c3c6d7",
      },

      // ── Spacing ──────────────────────────────────────────────────────────
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        gutter: "24px",
        "container-max": "1280px",
      },

      // ── Border radius ────────────────────────────────────────────────────
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "12px",
        "2xl": "16px",
        full: "9999px",
      },

      // ── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        "display-lg": [
          "48px",
          { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "display-lg-mobile": [
          "36px",
          { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-lg": [
          "32px",
          { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "headline-md": [
          "24px",
          { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "title-lg": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "title-md": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "26px", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-md": [
          "12px",
          { lineHeight: "16px", letterSpacing: "0.01em", fontWeight: "500" },
        ],
        "label-sm": [
          "11px",
          { lineHeight: "14px", letterSpacing: "0.05em", fontWeight: "600" },
        ],
      },

      // ── Animations ───────────────────────────────────────────────────────
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        shimmer: "shimmer 3s infinite linear",
        "slide-in-toast": "slideInToast 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        slideInToast: {
          "0%": { transform: "translateY(200%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
