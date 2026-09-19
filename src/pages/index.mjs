import { existsSync } from 'node:fs';
import { esc, waLink } from '../../tools/layout.mjs';
import {
  sectionHead,
  divider,
  ctaStrip,
  featuredServices,
  galleryGrid,
  GALLERY,
  hoursTable,
} from '../../tools/components.mjs';

export default function home(site) {
  /* Drop a clip in at videos/hero.mp4 and the hero plays it. Until then the
     storefront photo stands in, rather than asking the browser for a file that
     isn't there. */
  const heroVideo = existsSync(new URL('../../videos/hero.mp4', import.meta.url))
    ? `<video class="hero-video" autoplay muted loop playsinline poster="images/hero-poster.svg" aria-hidden="true">
    <source src="videos/hero.mp4" type="video/mp4">
  </video>`
    : `<img class="hero-video" src="images/entrance-lights.jpg" alt="" aria-hidden="true" fetchpriority="high">`;
  return {
    file: 'index.html',
    title: `${site.name} — Barbershop in Mivida, New Cairo`,
    description: site.description,
    bodyClass: 'page-home',
    body: `
<section class="hero">
  <div class="hero-bg" aria-hidden="true"></div>
  ${heroVideo}
  <div class="hero-overlay" aria-hidden="true"></div>
  <div class="cursor-glow" id="cursorGlow" aria-hidden="true"></div>
  <div class="hero-content">
    <img src="images/logo.png" alt="${esc(site.name)}" class="hero-logo" width="260" height="76">
    <p class="eyebrow center">Mivida · New Cairo</p>
    <h1>Where a cut<br>becomes <em>an escape</em></h1>
    <p class="hero-sub">Modern barbering, old-world detail. Fades, beards, straight-razor finishes — in a room built to slow you down.</p>
    <div class="hero-actions center">
      <a href="book.html" class="btn btn-primary">Book an Appointment</a>
      <a href="services.html" class="btn btn-ghost">See the Menu</a>
    </div>
    <ul class="hero-facts">
      <li><strong>26</strong><span>services on the menu</span></li>
      <li><strong>7</strong><span>days a week</span></li>
      <li><strong>30 min</strong><span>a standard cut</span></li>
    </ul>
  </div>
  <a href="#story" class="scroll-cue" aria-label="Scroll to content"><span></span></a>
</section>

<section class="marquee" aria-hidden="true">
  <div class="marquee-track">
    <span>Fades</span><span>✦</span><span>Beard Sculpting</span><span>✦</span><span>Hot Towel</span><span>✦</span>
    <span>Colour</span><span>✦</span><span>Protein</span><span>✦</span><span>Kids' Cuts</span><span>✦</span>
    <span>Groom Packages</span><span>✦</span><span>Oil Baths</span><span>✦</span>
    <span>Fades</span><span>✦</span><span>Beard Sculpting</span><span>✦</span><span>Hot Towel</span><span>✦</span>
    <span>Colour</span><span>✦</span><span>Protein</span><span>✦</span><span>Kids' Cuts</span><span>✦</span>
    <span>Groom Packages</span><span>✦</span><span>Oil Baths</span><span>✦</span>
  </div>
</section>

<section class="about" id="story">
  <div class="about-media reveal">
    <div class="about-frame">
      <div class="frame-inner">
        <img src="images/storefront.jpg" alt="Escape Barbershop storefront at night" loading="lazy" width="900" height="600">
      </div>
    </div>
    <div class="frame-badge">
      <span>Est.</span>
      <strong>Mivida</strong>
    </div>
  </div>
  <div class="about-copy reveal">
    <p class="eyebrow">The place</p>
    <h2>Not just a barbershop.<br><em>An escape.</em></h2>
    <p>Low light, dark concrete, and a chair that finally lets your shoulders drop. Escape was built for people who want their grooming to feel like a reset — sharp lines, honest service, no rush.</p>
    <p>Every station is set up for precision: proper wash basins, hot towels, blades that are sharpened, not swapped out. Every visit ends the same way — you leave looking better than you walked in.</p>
    <div class="hero-actions" style="justify-content:flex-start">
      <a href="about.html" class="btn btn-ghost">Our Story</a>
      <a href="barbers.html" class="btn btn-ghost">Meet the Barbers</a>
    </div>
  </div>
</section>

${divider}

<section class="services">
  ${sectionHead('Services', 'Crafted, <em>not rushed</em>', 'Twenty-six services, from a thirty-minute fade to a two-hour protein treatment.')}
  ${featuredServices(site)}
  <div class="hero-actions center" style="margin-top:3rem">
    <a href="services.html" class="btn btn-ghost">View the Full Menu</a>
    <a href="offers.html" class="btn btn-ghost">Packages &amp; Offers</a>
  </div>
</section>

${divider}

<section class="gallery">
  ${sectionHead('Inside Escape', 'The <em>space</em>', 'Shot in the shop, not in a stock library.')}
  ${galleryGrid({ filters: false, items: GALLERY.slice(0, 3) })}
  <div class="hero-actions center" style="margin-top:3rem">
    <a href="gallery.html" class="btn btn-ghost">See the Full Gallery</a>
  </div>
</section>

${divider}

<section class="visit-teaser">
  <div class="visit-teaser-grid">
    <div class="reveal">
      <p class="eyebrow">Find us</p>
      <h2>Eterna Mall,<br><em>Gate 2</em></h2>
      <p class="section-sub" style="text-align:left;margin-left:0">${esc(site.address.line1)} · ${esc(site.address.line2)}. Parking right by the gate.</p>
      <div class="hero-actions" style="justify-content:flex-start">
        <a href="${esc(site.address.mapsUrl)}" target="_blank" rel="noopener" class="btn btn-ghost">Open in Maps</a>
        <a href="visit.html" class="btn btn-ghost">Hours &amp; Directions</a>
      </div>
    </div>
    <div class="reveal">
      <h3 class="block-title">This week</h3>
      ${hoursTable(site)}
      <p class="cta-note" style="text-align:left">Times shown in shop time. Holidays can shift — call ahead if it's late.</p>
    </div>
  </div>
</section>

${ctaStrip(
  site,
  'Ready for a cut that feels like <em>an escape?</em>',
  `Send a booking request in under a minute, or message us on <a class="text-link" href="${esc(waLink(site, `Hi ${site.name}, I'd like to book an appointment.`))}" target="_blank" rel="noopener">WhatsApp</a>.`
)}
`,
  };
}
