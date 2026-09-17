# Escape Barbershop — Website

A modern, dark, single-page site for Escape Barbershop: hero, about, services, gallery, hours/location, and a booking CTA. Pure HTML/CSS/JS — no build step, no dependencies.

## Run it locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Replace the placeholders

**Photos** — `images/*.svg` are dark placeholder tiles standing in for your real photos. Drop your real shots in `images/` and update the matching `<img src="...">` in `index.html`:

| Placeholder file | Used for |
|---|---|
| `storefront.svg` | About section — storefront/interior shot |
| `facade.svg` | Gallery — illuminated sign & entrance |
| `pedicure-area.svg` | Gallery — pedicure area |
| `wash-station.svg` | Gallery — wash basins |
| `barber-chairs.svg` | Gallery — row of barber chairs |
| `entrance-lights.svg` | Gallery — pendant lighting shot |
| `hallway.svg` | Gallery — corridor |
| `floor-overview.svg` | Gallery — overview of the floor |

Any aspect ratio works — the CSS crops with `object-fit: cover`. For the moody black-and-white look, the gallery images are desaturated with CSS (`filter: grayscale(1)`), so you can drop in color photos and they'll still match; remove the filter in `css/style.css` (`.about-frame img`, `.gallery-item img`) if you'd rather show color.

**Logo** — the header/footer mark is drawn as inline SVG (a simple pin + razor glyph) so it needs no image file. If you have a logo file, swap the `<svg class="logo-mark">...</svg>` block in `index.html` for `<img src="images/logo.png" class="logo-mark" alt="Escape Barbershop">`.

**Text** — update the real address, phone, email, hours, and social links in the `#visit` section, and the phone number in the `href="tel:..."` links.

**Booking** — the "Book Now" buttons currently link to a phone number. Swap the `href` for your booking platform (Square, Fresha, Calendly, etc.) once you pick one.

## Structure

```
index.html       — page markup/content
css/style.css     — all styling
js/script.js      — mobile nav toggle + scroll-reveal animation
images/           — photos (currently placeholders)
```
