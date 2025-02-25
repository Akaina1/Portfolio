/**
 * Tailwind configuration file.
 * Combines all safelist items so dynamically fetched classes are preserved.
 */
import tailwindTypography from '@tailwindcss/typography';
import tailwindAnimated from 'tailwindcss-animated';

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './src/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  // IMPORTANT: Ensure you have a single `safelist` combining all needed patterns and classes.
  safelist: [
    // Patterns with variants for color and gradients:
    {
      pattern:
        /^text-(black|gray|blue|red|white|slate-background|dark-background|neutral-400|neutral-500|neutral-700|rose-200|rose-500|transparent)$/,
      variants: ['dark'],
    },
    {
      pattern:
        /^(from|via|to)-(neutral-400|neutral-500|neutral-700|rose-200|rose-500|white)$/,
      variants: ['dark'],
    },
    {
      pattern: /^bg-(gradient-to-[trbl]|clip-text)$/,
    },
    {
      pattern:
        /^text-(gray|blue|red|white)-(100|200|300|400|500|600|700|800|900)$/,
      variants: ['dark'],
    },
    // Additional utility classes from your config:
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [
    tailwindAnimated,
    tailwindTypography,
    function ({ addUtilities, theme }) {
      const gradients = theme('textGradient', {});
      const utilities = Object.entries(gradients).reduce(
        (acc, [name, value]) => {
          return {
            ...acc,
            [`.text-gradient-${name}`]: {
              'background-image': value,
              'background-clip': 'text',
              '-webkit-background-clip': 'text',
              color: 'transparent',
              '--tw-gradient-from': '#a3a3a3', // neutral-400
              '--tw-gradient-via': '#737373', // neutral-500
              '--tw-gradient-to': '#404040', // neutral-700
            },
          };
        },
        {}
      );
      addUtilities(utilities);
    },
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: {
        '2xl': '2rem',
        DEFAULT: '1rem',
        lg: '2rem',
        md: '2rem',
        sm: '1rem',
        xl: '2rem',
      },
      screens: {
        '2xl': '86rem',
        lg: '64rem',
        md: '48rem',
        sm: '40rem',
        xl: '80rem',
      },
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        dividerGlow: 'dividerGlow 2s linear infinite',
        clickExpand: 'clickExpand 1s ease-out forwards',
      },
      width: {
        '8xl': '90rem',
        '9xl': '100rem',
        '10xl': '110rem',
      },
      maxWidth: {
        '8xl': '90rem',
        '9xl': '100rem',
        '10xl': '110rem',
      },
      borderRadius: {
        '5xl': '2rem',
        '4xl': '1.75rem',
        '3xl': '1.5rem',
        '2xl': '1.25rem',
        xl: '1rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        button: '0.6rem',
      },
      dropShadow: {
        light: [
          '0 2px 1px rgba(0, 0, 0, 0.18)',
          '0 1px 2px rgba(0, 0, 0, 0.12)',
          '0 4px 8px rgba(0, 0, 0, 0.09)',
          '0 8px 16px rgba(0, 0, 0, 0.06)',
        ],
        dark: [
          '0 2px 1px rgba(0, 0, 0, 0.45)',
          '0 -1px 2px rgba(0, 0, 0, 0.35)',
          '0 1px 3px rgba(18, 18, 18, 0.25)',
          '0 4px 8px rgba(24, 24, 24, 0.15)',
        ],
        'dark-soft': [
          '0 2px 1px rgba(0, 0, 0, 0.25)',
          '0 -1px 2px rgba(0, 0, 0, 0.2)',
          '0 1px 3px rgba(18, 18, 18, 0.15)',
          '0 4px 8px rgba(24, 24, 24, 0.1)',
        ],
        'dark-outline': [
          '0 0 1px rgba(15, 15, 15, 0.65)',
          '0 0 1px rgba(15, 15, 15, 0.65)',
        ],
        'dark-outline-white': [
          '0 2px 1px rgba(255, 255, 255, 0.18)',
          '0 1px 2px rgba(255, 255, 255, 0.12)',
          '0 4px 8px rgba(255, 255, 255, 0.09)',
          '0 8px 16px rgba(255, 255, 255, 0.06)',
        ],
      },
      textGradient: {
        'neutral-fade':
          'linear-gradient(to bottom, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to))',
      },
      colors: {
        'dark-text': '#A3A3A3', // A muted gray that's easier on the eyes than white
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        border: 'hsla(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        foreground: 'hsl(var(--foreground))',
        input: 'hsl(var(--input))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        ring: 'hsl(var(--ring))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
        warning: 'hsl(var(--warning))',
        'dark-background': 'rgb(32, 37, 43)',
        'slate-background': 'rgb(38, 50, 56)',
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)'],
        sans: ['var(--font-geist-sans)'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        dividerGlow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        clickExpand: {
          '0%': {
            transform: 'scale(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
      },
      typography: ({ _theme }) => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '2rem',
              },
            },
          ],
        },
      }),
    },
  },
};

export default tailwindConfig;
