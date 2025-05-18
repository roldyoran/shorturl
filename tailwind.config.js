/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',       // Naranja-rosa
        secondary: '#845EC2',     // Morado
        accent: '#00C9A7',        // Verde aqua
        'accent-hover': '#00A896',
        'blue-light': '#4D8AF0',  // Azul claro
        'pink-light': '#FF9D9D',  // Rosa claro
        'purple-light': '#B39CD0', // Morado claro
        'green-light': '#98F5E1',  // Verde claro
        'card-bg': '#FFFFFF',
        'input-bg': '#F9FAFB',
        'border-color': '#E5E7EB',
        'text-primary': '#111827',
        'text-secondary': '#6B7280'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: [],
}