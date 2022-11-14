/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#f056c7',
        secondary: '#8b87ea',
        alt: '#ff3d78'
      },
      fontFamily: {
        nanum: ['NanumPenScript', 'sans-serif']
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '*': {
              color: theme('colors.white'),
              background: theme('colors.black')
            }
          }
        }
      })
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
