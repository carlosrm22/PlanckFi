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
        // Paleta cromática PlanckFi 2025
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#1C3BFF', // Primary 500 - Confianza
          600: '#152FCC', // Primary 600 - Hover
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        accentA: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6', // Éxito
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        accentB: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Advertencia
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Surface glass para glassmorphism
        surface: {
          light: 'rgba(255, 255, 255, 0.6)',
          dark: 'rgba(30, 41, 59, 0.6)',
        },
        // Gradientes personalizados
        gradient: {
          primary: 'linear-gradient(135deg, #1C3BFF 0%, #14B8A6 100%)',
          glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        }
      },
      fontFamily: {
        sans: ['InterVariable', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['InterVariable', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Escala modular 1.2
        'xs': ['0.75rem', { lineHeight: '1.4' }],
        'sm': ['0.875rem', { lineHeight: '1.4' }],
        'base': ['1rem', { lineHeight: '1.4' }],
        'lg': ['1.2rem', { lineHeight: '1.4' }],
        'xl': ['1.44rem', { lineHeight: '1.3' }],
        '2xl': ['1.728rem', { lineHeight: '1.3' }],
        '3xl': ['2.074rem', { lineHeight: '1.2' }],
        '4xl': ['2.488rem', { lineHeight: '1.1' }],
        '5xl': ['2.986rem', { lineHeight: '1.1' }],
        '6xl': ['3.583rem', { lineHeight: '1' }],
      },
      backdropBlur: {
        'glass': '8px',
        'glass-lg': '12px',
        'glass-xl': '16px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 16px 64px 0 rgba(31, 38, 135, 0.37)',
        'neubrutalist': '4px 4px 0px 0px rgba(0, 0, 0, 0.9)',
        'neubrutalist-lg': '8px 8px 0px 0px rgba(0, 0, 0, 0.9)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'glass': '16px',
        'neubrutalist': '8px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1C3BFF 0%, #14B8A6 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-dark': 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(30,41,59,0.6) 100%)',
      },
    },
  },
  plugins: [
    // Plugin para glassmorphism
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.neubrutalist': {
          boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.9)',
          transform: 'translate(-2px, -2px)',
        },
        '.neubrutalist:hover': {
          transform: 'translate(0px, 0px)',
          boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 0.9)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} 