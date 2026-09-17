# Escape Barbershop — Website

A dark, upscale multi-page site for Escape Barbershop. Serif display type (Fraunces) over a true black/white/ivory palette (matching the shop's monochrome logo and photography), six separate HTML pages. The only thing with a build step is the site's interactive logic, which is written in TypeScript.

## Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, story teaser, services teaser, gallery teaser, booking CTA |
| `about.html` | About — full story, stats, supporting photos |
| `services.html` | Services — the full menu |
| `gallery.html` | Gallery — all photos |
| `visit.html` | Visit — hours, location, map slot |
| `contact.html` | Contact — phone/email, address, and social icons |

Header and footer (with the same nav, live status pill, and links) are repeated at the top/bottom of every page — there's no shared template since this is plain HTML, so if you edit the nav or footer, update it in all six files.

## Run it locally

Just open `index.html` in a browser, or serve the folder so relative links behave exactly like a real deployment:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Design system

- **Type** — Fraunces (serif, used italic for accents) for headings and the logo wordmark; Inter for body copy and UI labels.
- **Palette** — true monochrome: near-black background, off-white/ivory text, neutral grey for secondary text, white used as the sole accent (dividers, hover fills, the "open now" pulse dot) — no color, matching the shop's black-and-white logo and photography. Tokens live at the top of `css/style.css` (`--gold`/`--gold-soft`/`--gold-dim` are the accent variable names, kept from an earlier draft, but their values are white/grey, not literally gold).
- **Services** are presented as an editorial menu list (`services.html`), not boxed cards.
- **Photos** are grayscale (`filter` on `.about-frame img` / `.gallery-item img` in `css/style.css`) so mixed-quality source photos still read as one consistent palette. Remove the filter there if you'd rather show full color.

## Photos

| File | Used on | Status |
|---|---|---|
| `storefront.jpg` | Home, About | ✅ real photo |
| `pedicure-area.jpg` | Home, About, Gallery | ✅ real photo |
| `wash-station.jpg` | Home, About, Gallery | ✅ real photo |
| `barber-chairs.jpg` | Gallery | ✅ real photo |
| `entrance-lights.jpg` | Home, Gallery | ✅ real photo |
| — | Gallery — illuminated sign & entrance | still a placeholder tile |
| — | Gallery — corridor | still a placeholder tile |
| — | Gallery — floor overview | still a placeholder tile |

The three remaining gallery slots render as an elegant "coming soon" tile (see `.placeholder-tile` in `css/style.css`) rather than a broken image — drop a photo into `images/` and swap the matching `<div class="placeholder-tile">…</div>` block in `gallery.html` for an `<img>` tag once you have it.

**Logo** — `images/logo.png`, used in the header, home hero, and every footer.

**Hero video** — see `videos/README.md`. Drop a clip in as `videos/hero.mp4` and it autoplays muted/looped behind the home hero; until then a plain dark poster shows instead.

**Map** — `visit.html` has a placeholder tile where a Google Maps embed would go. The "Open in Maps" link on that page already points to a real Google Maps search for "Mivida Eterna Mall Gate 2" (taken from the address printed on your storefront photos) — swap it for the shop's exact Maps link once you have one. To add a real embedded map, get an `<iframe>` from Google Maps ("Share" → "Embed a map") and swap it in for the `.placeholder-tile` inside `.map-frame`.

**Social icons** — Instagram/TikTok/Facebook icon circles appear in every footer and, larger, on `contact.html`. All currently link to `#` — replace with your real profile URLs across all six files (search for `aria-label="Instagram"` etc.).

**Contact page** (`contact.html`) is a simple, centered info page — phone, email, address, and the social icons. No form.

**Text** — update the phone/email links (currently placeholders) across all six files, and the hours in both `visit.html` and the `HOURS` table near the top of `src/script.ts` (used to compute the live "open now / closed" pill; **not** `js/script.js` — see TypeScript section below) — keep them in sync.

**Booking** — "Book Now" / "Call to Book" buttons currently link to a placeholder phone number. Swap the `tel:` href for your real number, or a booking platform link (Square, Fresha, Calendly, etc.), across all six files.

**Nav width** — the nav switches to the hamburger menu below 1100px wide (not just on phones) since six links plus the status pill and Book Now button get cramped on tablets/small laptops otherwise. Adjust the `@media (max-width: 1100px)` breakpoint in `css/style.css` if you add/remove nav items.

## TypeScript

The site's logic is written in TypeScript (`src/script.ts`) and compiled to plain JavaScript (`js/script.js`), which is what the HTML pages actually load with `<script src="js/script.js">` — the same as before, just generated instead of hand-written.

**`js/script.js` is a build artifact — don't hand-edit it.** Edit `src/script.ts` and rebuild. Both the source and the compiled output are committed to the repo (the compiled file has to be, since GitHub Pages just serves whatever's in the branch — it doesn't run a build step). If you add a proper CI/CD pipeline later, you could stop committing `js/script.js` and build it during deploy instead.

To make a change:

```bash
npm install       # one-time, installs TypeScript locally (devDependency)
npm run build     # compiles src/script.ts → js/script.js
# or, while actively editing:
npm run watch     # rebuilds automatically on every save
```

Then commit both `src/script.ts` and the updated `js/script.js` together.

## Live/motion features

- Hero background video (autoplay, muted, looped) with a poster fallback.
- Live "open now / closed" status pill in the nav, computed from real hours in the visitor's local time.
- Scroll-reveal animation on sections, rows, and gallery tiles.
- Count-up animation on the About page's stat numbers when they scroll into view.
- Current-page highlighting in the nav (via `data-page` matching on each link).
- Header gains a solid background and shrinks slightly once you scroll.
- Subtle cursor-follow glow in the home hero on pointer devices.

## Structure

```
index.html, about.html, services.html, gallery.html, visit.html, contact.html  — pages
css/style.css     — design system + all styling
src/script.ts     — TypeScript source: nav, live status, scroll-reveal, count-up, cursor glow
js/script.js      — compiled output of src/script.ts (generated — don't hand-edit)
tsconfig.json, package.json  — TypeScript build config
images/           — photos + logo (see table above)
videos/           — hero background video (see videos/README.md)
```
