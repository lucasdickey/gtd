import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        vt323: ['var(--font-vt323)', 'sans-serif'],
      },
      colors: {
        'brand-beige': '#E6D5C3',
        'brand-brown': '#4A3C31',
        'brand-gold': '#CFA76E',
        'action-primary': '#E67E22',
        'action-secondary': '#7E5C3B',
        'action-accent': '#D4B483',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-blur': 'fadeInBlur 2s ease-out',
        'typewriter-first':
          'typing 2s steps(11, end), blink .75s steps(2) infinite, fadeOut 1s ease-out 4s forwards',
        'typewriter-second':
          'typing 1s steps(4, end), blink .75s steps(2) infinite',
        'delete-text': 'delete 1s steps(11, end), blink .75s steps(2) infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInBlur: {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0px)' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        delete: {
          '0%': { width: '100%' },
          '100%': { width: '0' },
        },
        blink: {
          '0%, 100%': { borderColor: 'black' },
          '50%': { borderColor: 'transparent' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [animate],
}
export default config
