/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Apple-inspired color palette
        apple: {
          gray: {
            50: '#f5f5f7',
            100: '#e8e8ed',
            200: '#d2d2d7',
            300: '#b0b0b8',
            400: '#86868b',
            500: '#6e6e73',
            600: '#515154',
            700: '#3a3a3c',
            800: '#2c2c2e',
            900: '#1c1c1e',
          },
          blue: {
            50: '#e8f4ff',
            100: '#d1e9ff',
            200: '#a8d5ff',
            300: '#7ab8ff',
            400: '#4c9aff',
            500: '#007aff',
            600: '#0066d6',
            700: '#0051ad',
            800: '#003d84',
            900: '#002a5c',
          },
          purple: {
            50: '#f3e8ff',
            100: '#e7d1ff',
            200: '#d0a3ff',
            300: '#b975ff',
            400: '#a247ff',
            500: '#8b1aff',
            600: '#7300e6',
            700: '#5c00bd',
            800: '#450094',
            900: '#2e006b',
          },
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'display-large': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.008em', fontWeight: '600' }],
        'title-1': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.005em', fontWeight: '600' }],
        'title-2': ['1.375rem', { lineHeight: '1.3', letterSpacing: '0em', fontWeight: '600' }],
        'title-3': ['1.125rem', { lineHeight: '1.4', letterSpacing: '0em', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.5', letterSpacing: '0em', fontWeight: '400' }],
        'callout': ['0.9375rem', { lineHeight: '1.45', letterSpacing: '0em', fontWeight: '400' }],
        'subhead': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0em', fontWeight: '400' }],
        'footnote': ['0.8125rem', { lineHeight: '1.38', letterSpacing: '0em', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.33', letterSpacing: '0em', fontWeight: '400' }],
      },
      boxShadow: {
        'apple-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'apple': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'apple-md': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'apple-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'apple-2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.2)',
        'apple-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'apple': '0.75rem',
        'apple-lg': '1rem',
        'apple-xl': '1.25rem',
        'apple-2xl': '1.5rem',
      },
      backdropBlur: {
        'apple': '20px',
        'apple-lg': '40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}

