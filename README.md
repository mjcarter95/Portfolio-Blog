# Academic Portfolio (Astro + Tailwind)

A CMSless academic website (portfolio + blog) built with Astro and Tailwind. Push to GitHub and deploy on Netlify.

## Quick start
1. **Install**: `npm i`
2. **Run dev**: `npm run dev` (http://localhost:4321)
3. **Add your hero image**: replace `public/images/hero.jpg` with your photo.
4. **Customize nav/logo**: edit `src/components/Header.astro` and `public/images/logo.svg`.
5. **Edit pages**: `src/pages/*`
6. **Writing (blog)**: add Markdown files in `src/content/writing/`.
7. **Publications**: add Markdown entries in `src/content/publications/` with frontmatter.
8. **Deploy to Netlify**: Connect repo → Build command `npm run build`, Publish directory `dist`.

## Notes
- Contact form uses Netlify Forms (no server).
- RSS/sitemap can be added later via Astro integrations.
