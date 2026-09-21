import { existsSync } from 'node:fs';
import { esc, waLink } from '../../tools/layout.mjs';
import {
  sectionHead,
  ctaStrip,
  featuredServices,
  mosaic,
  gallery,
  filmStrip,
  hoursTable,
} from '../../tools/components.mjs';

export default function home(site) {
  /* videos/hero.mp4 plays behind the hero when it's there; otherwise the
     entrance photo stands in, rather than asking for a file that isn't. */
  const heroVideo = existsSync(new URL('../../videos/hero.mp4', import.meta.url))
    ? `<video class="hero-video" autoplay muted loop playsinline poster="videos/hero-poster.jpg" aria-hidden="true">
    <source src="videos/hero.mp4" type="video/mp4">
  </video>`
    : `<img class="hero-video" src="images/entrance-lights.jpg" alt="" aria-hidden="true" fetchpriority="high">`;

  return {
    file: 'index.html',
    title: `${site.name} 💈 | Your Grooming Retreat in Mivida`,
    description: site.description,
    bodyClass: 'page-home dark-top',
    body: `
<section class="hero" data-rail="Escape">
  <div class="hero-bg" aria-hidden="true"></div>
  ${heroVideo}
  <div class="hero-overlay" aria-hidden="true"></div>
  <div class="cursor-glow" id="cursorGlow" aria-hidden="true"></div>
  <div class="hero-content">
    <img src="images/logo.png" alt="${esc(site.name)}" class="hero-logo" width="260" height="76">
    <p class="eyebrow center">Mivida · New Cairo</p>
    <h1><span class="line">Where a cut</span><span class="line">becomes <em>an escape</em></span></h1>
    <p class="hero-sub">Modern barbering, old-world detail. Fades, beards, hot-towel finishes — in a room built to slow you down.</p>
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

<section class="marquee theme-dark" aria-hidden="true">
  <div class="marquee-track">
    <span>Fades</span><span>✦</span><span>Beard Sculpting</span><span>✦</span><span>Hot Towel</span><span>✦</span>
    <span>Colour</span><span>✦</span><span>Protein</span><span>✦</span><span>Kids' Cuts</span><span>✦</span>
    <span>Groom Packages</span><span>✦</span><span>Oil Baths</span><span>✦</span>
    <span>Fades</span><span>✦</span><span>Beard Sculpting</span><span>✦</span><span>Hot Towel</span><span>✦</span>
    <span>Colour</span><span>✦</span><span>Protein</span><span>✦</span><span>Kids' Cuts</span><span>✦</span>
    <span>Groom Packages</span><span>✦</span><span>Oil Baths</span><span>✦</span>
  </div>
</section>

<section class="about stack" id="story" data-rail="The Place">
  <div class="about-media reveal">
    <div class="stack-frame stack-back">
      <img src="images/gallery/the-chairs/mirror-arches.jpg" alt="Barber chairs under arched mirrors" loading="lazy" width="1200" height="900">
    </div>
    <div class="stack-frame stack-front">
      <img src="images/gallery/details/climbers-on-the-wall.jpg" alt="Climbing figures mounted on the shop wall" loading="lazy" width="900" height="1200">
    </div>
    <div class="frame-badge">
      <span>Est.</span>
      <strong>Mivida</strong>
    </div>
  </div>
  <div class="about-copy reveal">
    <p class="eyebrow">The place</p>
    <h2>Not just a barbershop.<br><em>An escape.</em></h2>
    <p>Pale concrete, black steel, arched mirrors and two climbers scaling the wall above the sofa — the room was built to be worth the half hour, not just to hold a chair.</p>
    <p>Every station is set for precision: proper wash basins, hot towels, Kérastase and L'Oréal on the shelf, blades that are sharpened rather than swapped. You leave looking better than you walked in.</p>
    <div class="hero-actions" style="justify-content:flex-start">
      <a href="about.html" class="btn btn-ghost">Our Story</a>
      <a href="behind-the-chair.html" class="btn btn-ghost">Meet the Barbers</a>
    </div>
  </div>
</section>

<section class="ritual section-narrow" data-rail="The Ritual">
  ${sectionHead('The Ritual', 'What to <em>expect</em>')}
  <ol class="ritual-grid">
    <li class="ritual-step reveal">
      <h3>Walk in, or book ahead</h3>
      <p>Same-day chairs for walk-ins; a WhatsApp message holds your slot if you'd rather not wait.</p>
    </li>
    <li class="ritual-step reveal">
      <h3>Sit down, slow down</h3>
      <p>Hot towel, a proper wash, and a barber who asks before he cuts — not after.</p>
    </li>
    <li class="ritual-step reveal">
      <h3>The cut itself</h3>
      <p>Clipper and scissor work, shaped to your head, finished with a razor edge.</p>
    </li>
    <li class="ritual-step reveal">
      <h3>Leave looking sharp</h3>
      <p>Styled, brushed down, and out the door in less time than you expected.</p>
    </li>
  </ol>
</section>

<section class="services" data-rail="Services">
  ${sectionHead('Services', 'Crafted, <em>not rushed</em>', 'Twenty-six services, from a thirty-minute fade to a two-hour protein treatment.')}
  ${featuredServices(site)}
  <div class="hero-actions center" style="margin-top:2.8rem">
    <a href="services.html" class="btn btn-ghost">View the Full Menu</a>
    <a href="offers.html" class="btn btn-ghost">Packages &amp; Offers</a>
  </div>
</section>

<section class="reels theme-dark" data-rail="In the Shop">
  ${sectionHead('Thirty seconds inside', 'The <em>shop</em>, moving', 'Filmed in the chairs. No sound — just the work.')}
  ${filmStrip()}
</section>

<section class="gallery" data-rail="The Space">
  ${sectionHead('Inside Escape', 'The <em>space</em>', 'Shot on site, not in a stock library.')}
  ${mosaic(gallery(site).slice(0, 5))}
  <div class="hero-actions center" style="margin-top:2.8rem">
    <a href="gallery.html" class="btn btn-ghost">See the Full Gallery</a>
  </div>
</section>

<section class="visit-teaser" data-rail="Visit">
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
    <div class="reveal hours-panel">
      <h3 class="block-title">This week</h3>
      ${hoursTable(site)}
      <p class="cta-note" style="text-align:left">Shop time. Holidays can shift — call ahead if it's late.</p>
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
