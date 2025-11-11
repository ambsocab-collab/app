/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Industrial color palette with high visibility and safety colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Primary industrial blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a', // Completion green
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Warning orange
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        critical: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626', // Critical red
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        surface: {
          50: '#f8fafc', // Light gray for backgrounds
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
        text: {
          primary: '#0f172a',   // Dark gray for primary text
          secondary: '#64748b', // Medium gray for secondary text
          muted: '#94a3b8',     // Light gray for muted text
        },
        // Industrial-specific colors
        industrial: {
          safety: '#fbbf24',     // Safety yellow
          danger: '#dc2626',     // Danger red
          caution: '#f59e0b',    // Caution orange
          notice: '#2563eb',     // Notice blue
          emergency: '#7c3aed',  // Emergency purple
          machinery: '#0891b2',  // Machinery cyan
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'], // Technical data
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px - Minimum readable
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px - Body text minimum
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px - Default
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px - Important info
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px - Critical info
        '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px - Headers
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px - Large headers
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px - Titles
      },
      // Mobile-first breakpoints
      screens: {
        'xs': '320px',    // Extra small mobile
        'sm': '640px',    // Large mobile/tablet
        'md': '768px',    // Tablet (supervisor features)
        'lg': '1024px',   // Desktop (admin features)
        'xl': '1280px',   // Large desktop
        '2xl': '1536px',  // Extra large desktop
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      minWidth: {
        '48': '12rem',    // Minimum touch target 48x48px
        '44': '11rem',
        '40': '10rem',
      },
      minHeight: {
        '48': '12rem',    // Minimum touch target 48x48px
        '44': '11rem',
        '40': '10rem',
      },
      // Industrial-specific utilities
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        blink: {
          '0%, 50%, 100%': { opacity: '1' },
          '25%, 75%': { opacity: '0' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      // Industrial grid system for equipment layouts
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '17': 'repeat(17, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Form styling for Headless UI
  ],
}