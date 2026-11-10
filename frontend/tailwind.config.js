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
          dark: '#0A0E17',
          card: '#121927',
          cardBorder: '#1E293B',
          cardHover: '#1B2438',
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
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}

