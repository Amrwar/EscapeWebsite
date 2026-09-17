# Escape Barbershop — Website

A modern, dark, single-page site for Escape Barbershop: hero, about, services, gallery, hours/location, and a booking CTA. Pure HTML/CSS/JS — no build step, no dependencies.

## Run it locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Replace the placeholders

**Photos** — real shots are in for the storefront and three gallery spots; the rest are still dark placeholder tiles (`images/*.svg`) waiting for real photos. Drop new shots in `images/` and update the matching `<img src="...">` in `index.html`:

| File | Used for | Status |
|---|---|---|
| `storefront.jpg` | About section — storefront/interior shot | ✅ real photo |
| `pedicure-area.jpg` | Gallery — pedicure area | ✅ real photo |
| `wash-station.jpg` | Gallery — wash basins | ✅ real photo |
| `barber-chairs.jpg` | Gallery — row of barber chairs | ✅ real photo |
| `entrance-lights.jpg` | Gallery — pendant lighting & reception wall sign | ✅ real photo |
| `facade.svg` | Gallery — illuminated sign & entrance | placeholder |
| `hallway.svg` | Gallery — corridor | placeholder |
| `floor-overview.svg` | Gallery — overview of the floor | placeholder |
| `hero-poster.svg` | Hero video poster frame (shown until `videos/hero.mp4` exists) | placeholder |

The four real photos were cropped from the originals to cut off the baked-in logo watermark and the "Mivida, Eterna Mall Gate 2" caption text that were burned into the uploaded files, so they read as native site photography rather than reposted social graphics. `storefront.jpg` came from a low-resolution source (~390px wide) — it reads fine at its current size thanks to the grayscale filter, but would look soft if enlarged; swap in a higher-res version of that same shot if you have one.

Any aspect ratio works — the CSS crops with `object-fit: cover`. For the moody black-and-white look, the gallery images are desaturated with CSS (`filter: grayscale(1)`), so you can drop in color photos and they'll still match; remove the filter in `css/style.css` (`.about-frame img`, `.gallery-item img`) if you'd rather show color.

**Logo** — already wired up at `images/logo.png`, used in the header, hero, and footer.

**Hero video** — see `videos/README.md`. Drop a clip in as `videos/hero.mp4` and it autoplays muted/looped behind the hero; until then a static poster image shows instead.

**Text** — update the real address, phone, email, hours, and social links in the `#visit` section, and the phone number in the `href="tel:..."` links. The "open now / closed" pill in the nav and the "closes/opens at" times are computed live from the `HOURS` table at the top of `js/script.js` — keep that in sync with the hours listed in `#visit`.

**Booking** — the "Book Now" buttons currently link to a phone number. Swap the `href` for your booking platform (Square, Fresha, Calendly, etc.) once you pick one.

## Live/motion features

- Hero background video (autoplay, muted, looped) with a poster fallback.
- Live "open now / closed" status pill in the nav, computed from real hours in the visitor's local time.
- Scroll-reveal animation on sections, cards, and gallery tiles.
- Count-up animation on the stat numbers (5+, 7, 100%) when they scroll into view.
- Scrollspy — the nav link for the section currently in view is highlighted.
- Header gains a solid background and shrinks slightly once you scroll.
- Subtle cursor-follow glow in the hero on pointer devices.

## Structure

```
index.html       — page markup/content
css/style.css     — all styling
js/script.js      — nav, live status, scroll-reveal, count-up, scrollspy, cursor glow
images/           — photos + logo (some still placeholders, see table above)
videos/           — hero background video (see videos/README.md)
```
