import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'super-larger': '1300px',
      'mdlg': '1000px',
      'md': '768px',
      'super-small': '420px'
    },
    colors: {
      'dark-bg': '#1c1212',
      'bg': '#c0bfbf',
      'primary-red': '#f20202',
      'light-red': '#E14F4F',
      'dark-red': '#660606',
      'primary-yellow': '#E5D11A',
      'primary-orange': '#FFA740',
      'dark-orange': '#C55212',
      'primary-blue': '#387BAB',
      'light-blue': '#5E9ECB',
      'dark-blue': '#205174',
      'darker-blue': '#0B1C28',
      'gray': '#878787',
      'dark-gray': '#505050',
      'green': '#35A500',
      'dark-green': '#216700',
      'light-green': '#43D200',
      'black': '#000',
      'white': '#fff'
    },
    fontSize: {
      sm: '0.5rem',
      base: '.75rem',
      'base-xl': '0.85rem',
      xl: '1rem',
      xll: '1.12rem',
      '2xl': '1.25rem',
      '3xl': '1.563rem',
      '4xl': '1.953rem',
      '5xl': '2.441rem',
    },
  },
  plugins: [],
};
export default config;
