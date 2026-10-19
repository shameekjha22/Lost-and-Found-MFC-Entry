/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        vt: ['"VT323"', 'monospace'],
        mono: ['"VT323"', 'monospace'],
      },
      colors: {
        pacman: {
          yellow:  '#FFE000',
          yellow2: '#FFD700',
          blue:    '#2121DE',
          blinky:  '#FF0000',   // red ghost — Lost
          inky:    '#00FFEE',   // cyan ghost — Found
          pinky:   '#FFB8FF',   // pink ghost — Claimed
          clyde:   '#FFB852',   // orange ghost
          scared:  '#0000FF',
          maze:    '#1a1aff',
          dot:     '#FFE000',
          bg:      '#000000',
          card:    '#0d0d1a',
          border:  '#1f1f6e',
        },
      },
      boxShadow: {
        'pacman': '0 0 12px #FFE000aa',
        'ghost-red': '0 0 10px #FF0000aa',
        'ghost-cyan': '0 0 10px #00FFEEaa',
        'ghost-pink': '0 0 10px #FFB8FFaa',
      },
      animation: {
        'chomp': 'chomp 0.4s steps(2) infinite',
        'flicker': 'flicker 1.5s ease-in-out infinite',
        'dot-pulse': 'dot-pulse 1s ease-in-out infinite',
      },
      keyframes: {
        chomp: {
          '0%':   { clipPath: 'polygon(100% 50%, 0% 0%, 0% 100%)' },
          '50%':  { clipPath: 'polygon(100% 50%, 15% 15%, 15% 85%)' },
          '100%': { clipPath: 'polygon(100% 50%, 0% 0%, 0% 100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        'dot-pulse': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%':      { opacity: '1',   transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
