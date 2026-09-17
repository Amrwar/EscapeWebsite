# Legacy static site (pre-Next.js)

This is the plain HTML/CSS/JS version of the site, exactly as it was before the move to Next.js + TypeScript. Kept here for reference — it is not part of the live site and Next.js doesn't build or serve anything in this folder.

## To run it standalone

The HTML files reference `images/...` and `videos/...`. Those images now live at `../../public/images/` (same files, just moved during the Next.js migration), and the hero poster/video slot lives at `../from-video-hero/public/`. To actually run this version in a browser:

```bash
cd _archive/legacy-static-site
mkdir -p images videos
cp ../../public/images/*.jpg ../../public/images/*.png images/
cp ../from-video-hero/public/hero-poster.svg images/
cp -r ../from-video-hero/public/videos/* videos/
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## What's here

- `index.html`, `about.html`, `services.html`, `gallery.html`, `visit.html`, `contact.html` — the six pages
- `css/style.css` — all styling
- `src/script.ts` / `js/script.js` — the TypeScript source and its compiled output (nav, live status pill, scroll-reveal, count-up, cursor glow)
- `package.json`, `package-lock.json`, `tsconfig.json` — the TypeScript build setup used at the time
- `vercel.json` — the static-site deploy config (not needed for the current Next.js version, which Vercel auto-detects)
