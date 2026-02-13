/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5", // Indigo-600
          hover: "#4338CA", // Indigo-700
          light: "#818CF8", // Indigo-400
        },
        secondary: {
          DEFAULT: "#8B5CF6", // Violet-500
          hover: "#7C3AED", // Violet-600
        },
        success: {
          DEFAULT: "#10B981", // Emerald-500
          light: "#D1FAE5", // Emerald-100
        },
        warning: {
          DEFAULT: "#F59E0B", // Amber-500
          light: "#FEF3C7", // Amber-100
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
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(79, 70, 229, 0.3)',
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
