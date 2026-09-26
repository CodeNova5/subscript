/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          app: '#090A0F',
          surface1: '#12141C',
          surface2: '#1A1D27',
          hover: '#242836',
        },
        border: {
          subtle: '#232734',
          focus: '#4F46E5',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        brand: {
          primary: '#6366F1',
          hover: '#4F46E5',
        },
        accent: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
