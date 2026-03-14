/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5b5bd6", // Purple gradient start
          hover: "#4f4fbd",
          light: "#8282e3",
        },
        secondary: {
          DEFAULT: "#7c3aed", // Violet gradient end
          hover: "#6d28d9",
        },
        success: {
          DEFAULT: "#10B981", // Green for positive
          light: "#D1FAE5",
        },
        danger: {
          DEFAULT: "#EF4444", // Red for negative
          light: "#FEE2E2",
        },
        analytics: {
          DEFAULT: "#8B5CF6", // Purple for analytics
          light: "#EDE9FE",
        },
        warning: {
          DEFAULT: "#F59E0B", // Amber
          light: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#EF4444", // Red-500
          light: "#FEE2E2", // Red-100
        },
        dark: {
          DEFAULT: "#0F172A", // Slate-900
          light: "#1E293B", // Slate-800
          lighter: "#334155", // Slate-700
        },
        light: {
          DEFAULT: "#F8FAFC", // Slate-50
          dark: "#E2E8F0", // Slate-200
        },
        text: {
          primary: "#1E293B", // Slate-800
          secondary: "#64748B", // Slate-500
          muted: "#94A3B8", // Slate-400
          inverted: "#F8FAFC", // Slate-50
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 15px rgba(91, 91, 214, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      },
    },
  },
  plugins: [],
}
