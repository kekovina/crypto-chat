import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF7400',
        secondary: '#C15B16',
        additional: '#F4E7C9',
        disabled: '#E6E6E6',
        danger: '#FF4D4D',
        warning: '#FFC107',
        info: '#2196F3',
        message: '#6C757D',
        grey: {
          light: '#EFF1F4',
          DEFAULT: '#353535',
          dark: '#353535',
        },
      },
      container: {
        screens: {
          sm: '100%',
          md: '768px',
          lg: '1024px',
          xl: '1200px',
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [],
};
export default config;
