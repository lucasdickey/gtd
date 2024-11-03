/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'typewriter-first': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'typewriter-second': {
          '0%': { width: '0%' },
          '100%': { width: '75%' },
        },
        'delete-text': {
          '0%': { width: '75%' },
          '100%': { width: '0%' },
        },
        'fade-in-blur': {
          '0%': {
            opacity: '0',
            filter: 'blur(10px)',
          },
          '100%': {
            opacity: '1',
            filter: 'blur(0)',
          },
        },
      },
      animation: {
        'typewriter-first': 'typewriter-first 2s steps(20) forwards',
        'typewriter-second': 'typewriter-second 1s steps(20) forwards',
        'delete-text': 'delete-text 1s steps(20) forwards',
        'fade-in-blur': 'fade-in-blur 1s ease-out forwards',
      },
    },
  },
  plugins: [],
}
