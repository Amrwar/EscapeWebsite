# Escape Barbershop — Website

A dark, upscale multi-page site for Escape Barbershop, built with **Next.js (App Router) and TypeScript**, deployed on **Vercel**. Serif display type (Fraunces) over a true black/white/ivory palette matching the shop's monochrome logo and photography.

There is no HTML written by hand anywhere in this project — every page is a React component (`.tsx`), and Next.js turns that into HTML at build time.

## Run it locally

```bash
npm install
npm run dev
```

Then visit `http://localhost:3000`. (`npm run build && npm run start` runs the production build instead, closer to what Vercel actually serves.)

## Pages

| Route | File | Page |
|---|---|---|
| `/` | `app/page.tsx` | Home — hero, story teaser, services teaser, gallery teaser, booking CTA |
| `/about` | `app/about/page.tsx` | About — full story, stats, supporting photos |
| `/services` | `app/services/page.tsx` | Services — the full menu |
| `/gallery` | `app/gallery/page.tsx` | Gallery — all photos |
| `/visit` | `app/visit/page.tsx` | Visit — hours, location, embedded map |
| `/contact` | `app/contact/page.tsx` | Contact — phone/email, address, social icons |

`app/layout.tsx` is the shared root layout: it renders `<Header>` and `<Footer>` once and wraps every page's content in between, so — unlike the old hand-written HTML version — the nav and footer only exist in one place (`components/Header.tsx`, `components/Footer.tsx`), not copy-pasted six times.

## Design system

- **Type** — Fraunces (serif, used italic for accents) for headings and the logo wordmark; Inter for body copy and UI labels.
- **Palette** — true monochrome: near-black background, off-white/ivory text, neutral grey for secondary text, white used as the sole accent (dividers, hover fills, the "open now" pulse dot) — no color, matching the shop's black-and-white logo and photography.
- **Services** are presented as an editorial menu list (`/services`), not boxed cards.
- **Gallery** (`.gallery-grid`) is a masonry (CSS multi-column) layout: each photo displays at its own natural aspect ratio with no cropping.
- **Photos** are grayscale (`filter` on `.about-frame img` / `.gallery-item img` in `app/globals.css`) so mixed-quality source photos still read as one consistent palette. Remove the filter there if you'd rather show full color.

## Components

| Component | Type | What it does |
|---|---|---|
| `Header` | Client | Nav, mobile menu toggle, active-link highlighting (via `usePathname`), shrinks on scroll |
| `Footer` | Server | Logo, nav links, social icons, copyright |
| `StatusPill` | Client | The live "open now / closed" pill, computed from real hours in the visitor's local time, in the nav |
| `Reveal` | Client | Wraps a section/card/row; fades it in via `IntersectionObserver` when scrolled into view |
| `CountUp` | Client | Animates a stat number up from 0 when scrolled into view (used on `/about`) |
| `CursorGlow` | Client | Subtle glow that follows the cursor in the home hero, pointer devices only |
| `SocialIcons` | Server | Instagram/TikTok/Facebook icon circles, reused in every footer and on `/contact` |
| `Year` | Client | Always-current copyright year in the footer |
| `PlaceholderTile` | Server | The "Coming Soon" tile used for gallery slots without a photo yet |

Server components render to static HTML at build time; client components (`'use client'` at the top of the file) are the only ones that ship JavaScript to the browser and use hooks/browser APIs.

## Photos

| File | Used on | Status |
|---|---|---|
| `storefront.jpg` | Home, About, Gallery (illuminated entrance sign) | ✅ real photo |
| `pedicure-area.jpg` | Home, About, Gallery | ✅ real photo |
| `wash-station.jpg` | Home, About, Gallery | ✅ real photo |
| `barber-chairs.jpg` | Gallery | ✅ real photo |
| `entrance-lights.jpg` | Home, Gallery | ✅ real photo |
| — | Gallery — corridor | still a placeholder tile |
| — | Gallery — floor overview | still a placeholder tile |

The two remaining gallery slots render as an elegant "coming soon" tile (`<PlaceholderTile label="..." />`) rather than a broken image — drop a photo into `public/images/`, then replace the matching `<PlaceholderTile>` in `app/gallery/page.tsx` with an `<img>` tag once you have it.

**Logo** — `public/images/logo.png`, used in the header, home hero, and every footer.

**Hero video** — see `public/videos/README.md`. Drop a clip in as `public/videos/hero.mp4` and it autoplays muted/looped behind the home hero (`app/page.tsx`); until then a plain dark poster (`public/images/hero-poster.svg`) shows instead.

**Map** — `/visit` embeds a real, live Google Map (`https://www.google.com/maps?q=...&output=embed`, a no-API-key embed built from the shop's address), plus links to the shop's actual Google Maps listing (`https://share.google/7Xe5DxwhBiDTLbYOz`). For a pin-accurate embed tied to the exact listing instead of an address search, get the `<iframe>` snippet from Google Maps → your location → "Share" → "Embed a map", and swap it in for the `<iframe>` in `app/visit/page.tsx`.

**Social icons** — Instagram/TikTok/Facebook links currently point to `#`. Search for `aria-label="Instagram"` in `components/SocialIcons.tsx` (one file now, instead of six) and replace with your real profile URLs.

**Text** — update the phone/email links (currently placeholders, search for `+10000000000` / `hello@escapebarbershop.com`) and the hours, which live in exactly two places that need to stay in sync: the `HOURS` table in `components/StatusPill.tsx` (drives the live pill) and the `<ul className="hours-list">` in `app/visit/page.tsx` (what visitors read).

**Booking** — "Book Now" / "Call to Book" buttons currently link to a placeholder phone number (`tel:+10000000000`). Swap it for your real number, or a booking platform link (Square, Fresha, Calendly, etc.).

## Live/motion features

- Hero background video (autoplay, muted, looped) with a poster fallback.
- Live "open now / closed" status pill in the nav, computed from real hours in the visitor's local time.
- Scroll-reveal animation on sections, rows, and gallery tiles.
- Count-up animation on the About page's stat numbers when they scroll into view.
- Client-side navigation with active-route highlighting in the nav.
- Header gains a solid background and shrinks slightly once you scroll.
- Subtle cursor-follow glow in the home hero on pointer devices.

## Deployment

Deployed on **Vercel**, which auto-detects Next.js and needs no config (there's no `vercel.json` — Next.js projects don't need one). Pushing to the connected branch triggers a new deployment automatically.

## Structure

```
app/
  layout.tsx           — root layout: <html>/<body>, Header, Footer, fonts, favicon
  globals.css          — design system + all styling (moved from the old css/style.css)
  page.tsx             — Home (/)
  about/page.tsx        — /about
  services/page.tsx     — /services
  gallery/page.tsx      — /gallery
  visit/page.tsx        — /visit
  contact/page.tsx      — /contact
components/            — Header, Footer, StatusPill, Reveal, CountUp, CursorGlow, SocialIcons, Year, PlaceholderTile
public/
  images/              — photos + logo (see table above)
  videos/              — hero background video (see public/videos/README.md)
package.json, tsconfig.json, next.config.mjs  — Next.js/TypeScript project config
```
