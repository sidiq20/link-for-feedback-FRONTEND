/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: "#F54E86", // Login Primary (Pink)
        "primary-hover": "#D93D71",
        "student-primary": "#2b8cee", // Student Dashboard Primary (Blue)
        "examiner-primary": "#2b8cee", // Examiner Dashboard Primary (Blue)
        "background-light": "#f6f7f8", 
        "background-dark": "#111a22",  // Dash Dark
        "card-dark": "#233648",        // Dash Card
        "text-secondary": "#92adc9",
        "surface-dark": "#121212",     // Login Surface
        "surface-border": "#27272a",   // Login Border
        whisper: {
          'bg-main': '#0F0F0F',
          'bg-card': '#1A1A1A',
          'text-primary': '#FFFFFF',
          'text-secondary': '#B0B0B0',
          'border': '#2E2E2E',
          'accent-pink': '#FF5C8A',
          'accent-yellow': '#FFD93D',
          'whisper-accent-pink': '#ff4b8f',
        },
        // Override default slate colors with our scheme
        slate: {
          50: '#FFFFFF',
          100: '#F8F8F8',
          200: '#E8E8E8',
          300: '#D0D0D0',
          400: '#B0B0B0',
          500: '#808080',
          600: '#606060',
          700: '#2E2E2E',
          800: '#1A1A1A',
          900: '#0F0F0F',
          950: '#0A0A0A',
        },
        // Remove purple and replace with our accents
        blue: {
          400: '#FF5C8A',
          500: '#FF5C8A',
          600: '#FF5C8A',
          700: '#E5527A',
        },
        purple: {
          400: '#FF5C8A',
          500: '#FF5C8A',
          600: '#FF5C8A',
          700: '#E5527A',
        },
      },
    },
  },
  plugins: [],
};