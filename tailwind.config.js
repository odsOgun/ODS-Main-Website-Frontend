/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        gray: {
          0: '#070707',
          1: '#595959',
          2: '#E3E3E3',
          3: '#181818'
        },
        ods: {
          green: '#00A651',
          'green-light': '#B9FBC0',
          'green-tint20': '#CCEDDC',
          'green-tint40': '#99DBB9',
          'green-tint80': '#33B885',
          purple: '#8E44AD',
          yellow: '#F4D35E',
          blue: '#06AED5',
          navy: '#31004A',
          black: '#1B1B1B',
          coral: '#FF5C5C',
          white: '#FFFFFF'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'reveal-in': {
          from: { opacity: '0', transform: 'translateY(22px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        reveal: 'reveal-in 0.7s ease forwards'
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)']
      },
      transitionDuration: {
        350: '350ms'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addComponents, addUtilities }) {
      addComponents({
        '.ticket': {
          'clip-path':
            'polygon(0% 10%, 6% 10%, 6% 0%, 94% 0%, 94% 10%, 100% 10%, 100% 90%, 94% 90%, 94% 100%, 6% 100%, 6% 90%, 0% 90%)'
        }
      });
      addUtilities({
        '.pattern-on-green': {
          'background-color': '#00A651',
          'background-image':
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='24' viewBox='0 0 48 24'%3E%3Cpolygon points='12,1 22,12 12,23 2,12' fill='white'/%3E%3Ccircle cx='36' cy='12' r='9' fill='white'/%3E%3Ccircle cx='36' cy='12' r='4.5' fill='%2300A651'/%3E%3C/svg%3E\")",
          'background-repeat': 'repeat-x',
          'background-size': '48px 24px',
          height: '24px',
          width: '100%'
        },
        '.pattern-on-white': {
          'background-color': '#FFFFFF',
          'background-image':
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='24' viewBox='0 0 48 24'%3E%3Cpolygon points='12,1 22,12 12,23 2,12' fill='%2300A651'/%3E%3Ccircle cx='36' cy='12' r='9' fill='%2300A651'/%3E%3Ccircle cx='36' cy='12' r='4.5' fill='white'/%3E%3C/svg%3E\")",
          'background-repeat': 'repeat-x',
          'background-size': '48px 24px',
          height: '24px',
          width: '100%'
        }
      });
    }
  ]
};
