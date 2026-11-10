/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fintech: {
          dark: '#060913',
          card: '#0D121F',
          cardBorder: '#1E293B',
          cardHover: '#131B2E',
          accent: '#6366F1', // Indigo
          accentHover: '#4F46E5',
          income: '#10B981', // Emerald green
          incomeBg: 'rgba(16, 185, 129, 0.1)',
          expense: '#F43F5E', // Rose red
          expenseBg: 'rgba(244, 63, 94, 0.1)',
          warning: '#F59E0B', // Amber
          warningBg: 'rgba(245, 158, 11, 0.1)',
          info: '#3B82F6', // Blue
          cyan: '#06B6D4',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glow-indigo': '0 0 35px -5px rgba(99, 102, 241, 0.35)',
        'glow-emerald': '0 0 35px -5px rgba(16, 185, 129, 0.35)',
        'glow-rose': '0 0 35px -5px rgba(244, 63, 94, 0.35)',
        'glow-cyan': '0 0 35px -5px rgba(6, 182, 212, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-reverse': 'floatReverse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
    },
  },
  plugins: [],
}
