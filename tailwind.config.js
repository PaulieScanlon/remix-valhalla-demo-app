/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
