/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - easy to change in one place
        brand: {
          dark: '#0f172a',      // slate-900
          darker: '#1e293b',    // slate-800
          medium: '#334155',    // slate-700
          light: '#64748b',     // slate-500
          accent: '#eab308',    // yellow-500
          'accent-hover': '#ca8a04', // yellow-600
          'accent-light': '#fef3c7', // yellow-100
        },
        // Keep primary as alias for backwards compatibility
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-0.5rem)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'in': 'fade-in 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in-from-top-2': 'slide-in-from-top 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
