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
        // iOS 18 Color Scheme - Apple Human Interface Guidelines 2025
        base: {
          100: '#FFFFFF', // Light mode background
          200: '#F2F2F7', // Light mode secondary background
          300: '#E5E5EA', // Light mode tertiary background
          400: '#D1D1D6', // Light mode separator
          500: '#C7C7CC', // Light mode opaque separator
          600: '#AEAEB2', // Light mode system gray
          700: '#8E8E93', // Light mode system gray 2
          800: '#636366', // Light mode system gray 3
          900: '#48484A', // Light mode system gray 4
          950: '#1C1C1E', // Light mode system gray 5
        },
        // Dark mode colors
        'base-dark': {
          100: '#000000', // Dark mode background
          200: '#1C1C1E', // Dark mode secondary background
          300: '#2C2C2E', // Dark mode tertiary background
          400: '#3A3A3C', // Dark mode separator
          500: '#48484A', // Dark mode opaque separator
          600: '#636366', // Dark mode system gray
          700: '#8E8E93', // Dark mode system gray 2
          800: '#AEAEB2', // Dark mode system gray 3
          900: '#C7C7CC', // Dark mode system gray 4
          950: '#F2F2F7', // Dark mode system gray 5
        },
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#0A84FF', // iOS Blue - Primary
          600: '#007AFF', // iOS Blue - Active
          700: '#0056CC',
          800: '#004499',
          900: '#002266',
        },
        secondary: {
          50: '#E8F5E8',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#30D158', // iOS Green - Success
          600: '#28A745',
          700: '#1E7E34',
          800: '#155724',
          900: '#0D3D1A',
        },
        accent: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF9500', // iOS Orange - Warning
          600: '#F57C00',
          700: '#EF6C00',
          800: '#E65100',
          900: '#FF3B30', // iOS Red - Error
        },
        // iOS System Colors
        system: {
          blue: '#0A84FF',
          green: '#30D158',
          indigo: '#5E5CE6',
          orange: '#FF9500',
          pink: '#FF2D92',
          purple: '#AF52DE',
          red: '#FF3B30',
          teal: '#40C8E0',
          yellow: '#FFD60A',
        }
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Helvetica Neue"',
          'sans-serif'
        ],
        mono: [
          'SF Mono',
          'Monaco',
          'Inconsolata',
          '"Roboto Mono"',
          'monospace'
        ],
      },
      fontSize: {
        // iOS 18 Typography Scale (px values)
        'xs': ['12px', { lineHeight: '16px', letterSpacing: '0.01em' }],
        'sm': ['14px', { lineHeight: '20px', letterSpacing: '0.01em' }],
        'base': ['17px', { lineHeight: '22px', letterSpacing: '0.01em' }],
        'lg': ['20px', { lineHeight: '25px', letterSpacing: '0.01em' }],
        'xl': ['24px', { lineHeight: '29px', letterSpacing: '0.01em' }],
        '2xl': ['28px', { lineHeight: '34px', letterSpacing: '0.01em' }],
        '3xl': ['34px', { lineHeight: '41px', letterSpacing: '0.01em' }],
        '4xl': ['41px', { lineHeight: '50px', letterSpacing: '0.01em' }],
        '5xl': ['49px', { lineHeight: '60px', letterSpacing: '0.01em' }],
        '6xl': ['59px', { lineHeight: '72px', letterSpacing: '0.01em' }],
      },
      spacing: {
        // 4-point grid system
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
        '40': '160px',
        '48': '192px',
        '56': '224px',
        '64': '256px',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '12px', // Universal container radius
        'md': '16px',
        'lg': '20px',
        'xl': '28px', // Prominent button radius
        '2xl': '32px',
        '3xl': '40px',
        'full': '9999px',
      },
      boxShadow: {
        // iOS Neumorphism shadows (elevation 1-4)
        'ios-1': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'ios-2': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'ios-3': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'ios-4': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        // Dark mode shadows
        'ios-1-dark': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        'ios-2-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'ios-3-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'ios-4-dark': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        // iOS 18 Motion - spring(0.55, 0.1, 0.4, 0.9) ≤ 280ms
        'ios-spring': 'iosSpring 0.28s cubic-bezier(0.55, 0.1, 0.4, 0.9)',
        'ios-spring-slow': 'iosSpring 0.4s cubic-bezier(0.55, 0.1, 0.4, 0.9)',
        'ios-fade-in': 'iosFadeIn 0.2s ease-out',
        'ios-slide-up': 'iosSlideUp 0.3s cubic-bezier(0.55, 0.1, 0.4, 0.9)',
        'ios-scale-in': 'iosScaleIn 0.2s cubic-bezier(0.55, 0.1, 0.4, 0.9)',
        'ios-pulse': 'iosPulse 1.2s ease-in-out infinite',
        'ios-float': 'iosFloat 3s ease-in-out infinite',
        'ios-shimmer': 'iosShimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        iosSpring: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        iosFadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        iosSlideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        iosScaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        iosPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        iosFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        iosShimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        'ios': '20px',
        'ios-lg': '30px',
        'ios-xl': '40px',
      },
      backgroundImage: {
        'ios-gradient': 'linear-gradient(135deg, #0A84FF 0%, #30D158 100%)',
        'ios-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'ios-shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      },
      // Safe area insets for iPhone 17
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      margin: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // Dynamic Island support
      inset: {
        'dynamic-island': 'calc(env(safe-area-inset-top) + 8px)',
      },
      // Tab bar height
      height: {
        'tab-bar': '44px',
        'tab-bar-safe': 'calc(44px + env(safe-area-inset-bottom))',
      },
      // Navigation bar
      minHeight: {
        'nav-bar': '44px',
        'nav-bar-large': '96px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    // iOS 18 specific utilities
    function({ addUtilities, addComponents, theme }) {
      // Safe area utilities
      addUtilities({
        '.safe-area-inset': {
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        },
        '.safe-area-inset-x': {
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        },
        '.safe-area-inset-y': {
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.safe-area-inset-t': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-area-inset-b': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.safe-area-inset-l': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.safe-area-inset-r': {
          paddingRight: 'env(safe-area-inset-right)',
        },
      })

      // iOS Glass effect
      addComponents({
        '.ios-glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.ios-glass-dark': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.ios-card': {
          backgroundColor: theme('colors.base.100'),
          borderRadius: theme('borderRadius.DEFAULT'),
          boxShadow: theme('boxShadow.ios-1'),
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
        '.ios-card-dark': {
          backgroundColor: theme('colors.base-dark.200'),
          borderRadius: theme('borderRadius.DEFAULT'),
          boxShadow: theme('boxShadow.ios-1-dark'),
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.ios-button': {
          backgroundColor: theme('colors.primary.500'),
          color: 'white',
          borderRadius: theme('borderRadius.xl'),
          padding: '12px 24px',
          fontSize: theme('fontSize.base[0]'),
          fontWeight: '600',
          transition: 'all 0.2s cubic-bezier(0.55, 0.1, 0.4, 0.9)',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        '.ios-button-secondary': {
          backgroundColor: theme('colors.base.200'),
          color: theme('colors.base.900'),
          borderRadius: theme('borderRadius.xl'),
          padding: '12px 24px',
          fontSize: theme('fontSize.base[0]'),
          fontWeight: '600',
          transition: 'all 0.2s cubic-bezier(0.55, 0.1, 0.4, 0.9)',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        '.ios-tab-bar': {
          height: '44px',
          paddingBottom: 'env(safe-area-inset-bottom)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        },
        '.ios-tab-bar-dark': {
          height: '44px',
          paddingBottom: 'env(safe-area-inset-bottom)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        },
      })
    }
  ],
} 