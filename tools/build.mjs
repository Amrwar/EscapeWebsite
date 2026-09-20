/**
 * Builds the site: every page under src/pages/ is poured into the shared shell
 * in tools/layout.mjs, using the shop's details from site.config.json, and
 * written out as plain HTML at the repo root. sitemap.xml and robots.txt are
 * generated at the same time so they can never fall out of step with the pages.
 *
 *   npm run build    — compile the TypeScript, then build the pages
 *   npm run dev      — same, then serve the folder on http://localhost:8000
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { render } from './layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const site = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));

const pagesDir = path.join(root, 'src', 'pages');
const files = (await readdir(pagesDir)).filter((f) => f.endsWith('.mjs')).sort();

const built = [];
for (const file of files) {
  const mod = await import(pathToFileURL(path.join(pagesDir, file)).href);
  const page = mod.default(site);
  await writeFile(path.join(root, page.file), render(page, site), 'utf8');
  built.push(page.file);
}

/* Search engines: every real page, newest-dated today, minus the 404. */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${built
  .filter((f) => f !== '404.html')
  .map((f) => {
    const loc = `${site.url}/${f === 'index.html' ? '' : f}`;
    const priority = f === 'index.html' ? '1.0' : f === 'book.html' ? '0.9' : '0.7';
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n')}
</urlset>
`;
await writeFile(path.join(root, 'sitemap.xml'), sitemap, 'utf8');

await writeFile(
  path.join(root, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
  'utf8'
);

/* Saved to a phone's home screen, this is what it's called and how it opens. */
await writeFile(
  path.join(root, 'site.webmanifest'),
  `${JSON.stringify(
    {
      name: site.name,
      short_name: site.shortName,
      description: site.description,
      start_url: '/index.html',
      display: 'standalone',
      background_color: '#090909',
      theme_color: '#090909',
      icons: [
        { src: '/images/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        { src: '/images/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      ],
    },
    null,
    2
  )}\n`,
  'utf8'
);

console.log(`Built ${built.length} pages: ${built.join(', ')}`);
console.log('Wrote sitemap.xml and robots.txt');

/* A loud reminder rather than a silent placeholder going live. */
const todo = [];
if (site.phoneHref.replace(/\D/g, '').endsWith('000000000')) todo.push('phone number');
if (site.email.includes('escapebarbershop.com')) todo.push('email address');
if (!Object.values(site.social).some(Boolean)) todo.push('social links');
if (!site.services.some((s) => s.price != null)) todo.push('prices (menu shows durations only until set)');
if (todo.length) {
  console.log(`\n⚠  Still placeholder in site.config.json: ${todo.join(', ')}`);
}
