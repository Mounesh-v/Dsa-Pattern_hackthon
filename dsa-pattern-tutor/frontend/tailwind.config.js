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
        // Light Theme
        background: {
          DEFAULT: '#F8FAFC',
          light: '#F1F5F9',
        },
        card: {
          DEFAULT: '#FFFFFF',
          light: '#F8FAFC',
        },
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
        accent: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          light: '#EEF2FF',
        },
        lightBlue: '#EEF2FF',
        border: {
          DEFAULT: '#E2E8F0',
          light: '#F1F5F9',
        },

        // Dark Theme
        dark: {
          background: '#0B0F19',
          card: '#111827',
          text: {
            primary: '#E5E7EB',
            secondary: '#9CA3AF',
            muted: '#6B7280',
          },
          accent: {
            DEFAULT: '#8B5CF6',
            hover: '#7C3AED',
            light: '#F3E8FF',
          },
          border: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        button: '8px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
