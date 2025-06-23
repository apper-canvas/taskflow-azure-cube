/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4FE9',
        secondary: '#8B7FF5',
        accent: '#FF6B6B',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 0.5s ease-out',
        'pulse-priority': 'pulse-priority 2s infinite',
        'checkmark-draw': 'checkmark-draw 0.3s ease-out'
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        'pulse-priority': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        },
        'checkmark-draw': {
          '0%': { strokeDashoffset: '20' },
          '100%': { strokeDashoffset: '0' }
        }
      }
    },
  },
  plugins: [],
}