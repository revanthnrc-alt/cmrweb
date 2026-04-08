/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': 'var(--bg-base)',
        'bg-surface': 'var(--bg-surface)',
        'bg-card': 'var(--bg-card)',
        'bg-hover': 'var(--bg-hover)',
        'accent-cyan': 'var(--accent-cyan)',
        'accent-amber': 'var(--accent-amber)',
        'accent-purple': 'var(--accent-purple)',
        'accent-green': 'var(--accent-green)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'border-subtle': 'var(--border-subtle)',
        'border-accent': 'var(--border-accent)',
      },
      fontFamily: {
        space: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
