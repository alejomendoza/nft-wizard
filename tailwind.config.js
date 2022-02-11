module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['sans-serif'],
    },
    extend: {
      colors: {
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
          cool: '#1A1B1D',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
};
