# Escape Barbershop — Website

A dark, upscale multi-page site for Escape Barbershop. Serif display type (Fraunces) with a gold/ivory-on-black palette, five separate pages, no build step or dependencies.

## Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, story teaser, services teaser, gallery teaser, booking CTA |
| `about.html` | About — full story, stats, supporting photos |
| `services.html` | Services — the full menu |
| `gallery.html` | Gallery — all photos |
| `visit.html` | Visit — hours, location, contact, map slot |

Header and footer (with the same nav, live status pill, and links) are repeated at the top/bottom of every page — there's no shared template since this is plain HTML, so if you edit the nav or footer, update it in all five files.

## Run it locally

Just open `index.html` in a browser, or serve the folder so relative links behave exactly like a real deployment:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Design system

- **Type** — Fraunces (serif, used italic for accents) for headings and the logo wordmark; Inter for body copy and UI labels.
- **Palette** — near-black background, warm ivory text, muted warm grey for secondary text, a soft brass/gold (`--gold`) for accents, dividers, hover states, and the "open now" indicator.
- **Services** are presented as an editorial menu list (`services.html`), not boxed cards.
- **Photos** are grayscale with a faint sepia tint (`filter` on `.about-frame img` / `.gallery-item img` in `css/style.css`) so mixed-quality source photos still read as one consistent, moody palette. Remove the filter there if you'd rather show full color.

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

**Map** — `visit.html` has a placeholder tile where a Google Maps embed would go. To wire up a real one, get an embed `<iframe>` from Google Maps ("Share" → "Embed a map") for your actual location and swap it in for the `.placeholder-tile` inside `.map-frame`.

**Text** — update the phone/email/social links (currently placeholders) across all five files, and the hours in both `visit.html` and the `HOURS` table at the top of `js/script.js` (used to compute the live "open now / closed" pill) — keep them in sync.

**Booking** — "Book Now" / "Call to Book" buttons currently link to a placeholder phone number. Swap the `tel:` href for your real number, or a booking platform link (Square, Fresha, Calendly, etc.), across all five files.

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
index.html, about.html, services.html, gallery.html, visit.html  — pages
css/style.css     — design system + all styling
js/script.js      — nav, live status, scroll-reveal, count-up, cursor glow
images/           — photos + logo (see table above)
videos/           — hero background video (see videos/README.md)
```
