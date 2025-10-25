/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        team: {
          red: '#D92D20',
          blue: '#1570EF',
          green: '#17B26A',
          yellow: '#F79009',
          purple: '#7A5AF8',
          orange: '#F04438',
        },
        warning: {
          border: '#98A2B3',
          badge: '#667085',
        }
      },
    },
  },
  plugins: [],
}
