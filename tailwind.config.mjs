/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx,vue,svelte}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto',
          'Helvetica', 'Arial', 'Apple Color Emoji', 'Segoe UI Emoji'
        ],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.gray.900'),
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              fontWeight: '600',
              '&:hover': { color: theme('colors.amber.700') },
            },
            h1: { color: theme('colors.gray.900'), fontWeight: '800' },
            h2: { color: theme('colors.gray.900'), scrollMarginTop: '6rem' },
            h3: { color: theme('colors.gray.900'), scrollMarginTop: '6rem' },
            'h1, h2, h3, h4': { lineHeight: '1.25' },
            blockquote: {
              borderLeftColor: theme('colors.gray.300'),
              color: theme('colors.gray.700'),
              fontStyle: 'normal',
            },
            code: {
              color: theme('colors.gray.900'),
              backgroundColor: theme('colors.gray.100'),
              borderRadius: theme('borderRadius.md'),
              padding: '0.15rem 0.35rem',
              fontWeight: '600',
            },
            'code::before, code::after': { content: '""' },
            pre: {
              color: theme('colors.gray.100'),
              backgroundColor: theme('colors.gray.900'),
              borderRadius: theme('borderRadius.xl'),
              padding: theme('spacing.4'),
            },
            img: { borderRadius: theme('borderRadius.xl') },
            hr: { borderColor: theme('colors.gray.200'), marginTop: '2rem', marginBottom: '2rem' },
            table: { width: '100%' },
            'thead th': { color: theme('colors.gray.900') },
            kbd: {
              backgroundColor: theme('colors.gray.100'),
              border: `1px solid ${theme('colors.gray.300')}`,
              borderBottomWidth: '2px',
              borderRadius: theme('borderRadius.md'),
              padding: '0 .3rem',
              fontWeight: '600',
            },
            'ul > li::marker': { color: theme('colors.gray.500') },
            'ol > li::marker': { color: theme('colors.gray.500') },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.300'),
            a: { color: theme('colors.white'), '&:hover': { color: theme('colors.amber.300') } },
            h1: { color: theme('colors.white') },
            h2: { color: theme('colors.white') },
            h3: { color: theme('colors.white') },
            blockquote: { borderLeftColor: theme('colors.gray.600'), color: theme('colors.gray.300') },
            code: { color: theme('colors.white'), backgroundColor: theme('colors.gray.800') },
            pre: { backgroundColor: theme('colors.gray.800') },
            hr: { borderColor: theme('colors.gray.700') },
            'thead th': { color: theme('colors.white') },
          },
        },
      }),
    },
  },
  safelist: [
    // Common prose variants you’ll use in templates
    'prose', 'prose-lg', 'prose-neutral', 'prose-slate', 'prose-invert',
  ],
  plugins: [require('@tailwindcss/typography')],
}
