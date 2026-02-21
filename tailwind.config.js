/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Blue-600
          hover: '#1d4ed8',   // Blue-700
          light: '#eff6ff',   // Blue-50
        },
        dark: {
          bg: '#0f172a',      // Slate-900
          card: '#1e293b',    // Slate-800
          text: '#f8fafc',    // Slate-50
          muted: '#94a3b8',   // Slate-400
        },
        light: {
          bg: '#f8fafc',      // Slate-50
          card: '#ffffff',    // White
          text: '#0f172a',    // Slate-900
          muted: '#64748b',   // Slate-500
        },
        success: '#22c55e',
        warning: '#eab308',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
};
