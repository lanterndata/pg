import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        teal: {
          '50': '#f2fbf8',
          '100': '#d4f3e9',
          '200': '#a9e6d4',
          '300': '#76d2ba',
          '400': '#4bb89f',
          '500': '#309c85',
          '600': '#247d6c',
          '700': '#216458',
          '800': '#1e5149',
          '900': '#1d443d',
          '950': '#0b2824',
        },
      },
    },
  },
  plugins: [],
};
export default config;
