/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#04050f',
          900: '#080c1a',
          800: '#0d1225',
          700: '#131830',
          600: '#1a2040',
        },
        arc: {
          400: '#7c94f5',
          500: '#5b79f0',
          600: '#3d5ce8',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        signal: {
          poor:      '#f43f5e',
          average:   '#fb923c',
          good:      '#38bdf8',
          excellent: '#34d399',
        }
      },
      backgroundImage: {
        'grid-ink': 'linear-gradient(rgba(91,121,240,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(91,121,240,0.07) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
      boxShadow: {
        'glow-arc':  '0 0 40px rgba(91,121,240,0.25)',
        'glow-cyan': '0 0 40px rgba(6,182,212,0.25)',
        'glow-green':'0 0 30px rgba(52,211,153,0.3)',
        'glow-red':  '0 0 30px rgba(244,63,94,0.3)',
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%':       { transform: 'scale(1.08)', opacity: '0.2' },
        },
        'scan': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 3s ease-in-out infinite',
        'scan':       'scan 6s linear infinite',
        'float':      'float 5s ease-in-out infinite',
        'spin-slow':  'spin-slow 20s linear infinite',
      },
    },
  },
  plugins: [],
}
