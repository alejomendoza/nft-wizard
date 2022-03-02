const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['IBM Plex Sans', 'sans-serif'],
      mono: ['IBM Plex Mono', 'monospace'],
    },
    extend: {
      colors: {
        stellar: {
          yolk: '#ffa51e',
          ochre: '#ff5500',
          violet: '#7d00ff',
          moss: '#00aa46',
          coal: '#000000',
          cloud: '#e1e1e1',
        },
        primary: {
          DEFAULT: 'var(--pal-brand-primary)',
          hover: 'var(--pal-brand-primary-hover)',
          on: 'var(--pal-brand-primary-on)',
        },
        background: {
          DEFAULT: 'var(--pal-background-primary)',
          secondary: 'var(--pal-background-secondary)',
          tertiary: 'var(--pal-background-tertiary)',
          tooltip: 'var(--pal-background-tooltip)',
        },
        success: {
          DEFAULT: 'var(--pal-success)',
          background: 'var(--pal-success-background)',
          border: 'var(--pal-success-border)',
          on: 'var(--pal-success-on)',
        },
        error: {
          DEFAULT: 'var(--pal-error)',
          background: 'var(--pal-error-background)',
          border: 'var(--pal-error-border)',
          on: 'var(--pal-error-on)',
        },
        warning: {
          DEFAULT: 'var(--pal-warning)',
          background: 'var(--pal-warning-background)',
          border: 'var(--pal-warning-border)',
          on: 'var(--pal-warning-on)',
        },
        info: {
          DEFAULT: 'var(--pal-info)',
          background: 'var(--pal-info-background)',
          border: 'var(--pal-info-border)',
          on: 'var(--pal-info-on)',
        },
        text: {
          DEFAULT: 'var(--pal-text-primary)',
          secondary: 'var(--pal-text-secondary)',
          tertiary: 'var(--pal-text-tertiary)',
          link: 'var(--pal-text-link)',
          hover: 'var(--pal-text-hover)',
        },
        border: {
          DEFAULT: 'var(--pal-border-primary)',
          secondary: 'val(--pal-border-secondary)',
        },
        example: {
          DEFAULT: 'var(--pal-example-details)',
          code: 'var(--pal-example-details)',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
};
