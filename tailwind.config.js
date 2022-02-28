module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['IBM Plex Sans', 'sans-serif'],
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
        blue: {
          DEFAULT: '#2563EB',
        },
        green: {
          DEFAULT: '#10B981',
        },
        red: { DEFAULT: '#E65050' },
        gray: {
          DEFAULT: '#F9FAFB',
          light: '#F3F4F6',
          cool: '#E5E7EB',
          dark: '#6B7280',
        },
        black: {
          DEFAULT: '#000000',
          cool: '#1A1B1D',
        },
        brand: {
          DEFAULT: '#5332e6',
          hover: '#937eef',
        },
        background: {
          DEFAULT: '#292d3e',
          secondary: '#303448',
          tertiary: '#222634',
          tooltip: '#191b25',
        },
        success: {
          DEFAULT: '#26db7b',
          background: '#284445',
          border: '#257554',
        },
        error: {
          DEFAULT: '#ee5a74',
          background: '#482f42',
          border: '#89344c',
        },
        warning: {
          DEFAULT: '#f8c252',
          background: '#4a433c',
          border: '#8f7138',
        },
        info: {
          DEFAULT: '#6260eb',
          background: '#2c2a57',
          border: '#33248c',
        },
        text: {
          DEFAULT: '#fff',
          secondary: '#d4d5d8',
          tertiary: '#a9abb2',
          link: '#6260eb',
          hover: '#937eef',
        },
        border: {
          DEFAULT: '#3a3e4d',
          secondary: '#4b4f5d',
        },
        example: {
          DEFAULT: '#303448',
          details: '#303448',
          code: '#222634',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
};
