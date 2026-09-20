import { esc, waLink } from '../../tools/layout.mjs';
import { hoursTable, ctaStrip, sectionHead, cover } from '../../tools/components.mjs';

export default function visit(site) {
  return {
    file: 'visit.html',
    title: `Visit Us — ${site.name}`,
    description: `Hours, directions and parking for ${site.name} at ${site.address.line1}, ${site.address.line2}.`,
    bodyClass: 'dark-top',
    body: `
${cover({
  eyebrow: 'Visit',
  title: 'Come <em>find us</em>',
  sub: `${esc(site.address.line1)} · ${esc(site.address.line2)}`,
  image: 'gallery/the-shop/storefront-at-night.jpg',
})}

<section class="visit" data-rail="Hours & Directions">
  <div class="visit-grid">
    <div class="visit-block reveal">
      <h3 class="block-title">Hours</h3>
      ${hoursTable(site)}
      <p class="status-inline" id="statusInline">Checking today's hours…</p>
    </div>
    <div class="visit-block reveal">
      <h3 class="block-title">Getting here</h3>
      <p>${esc(site.address.line1)}<br>${esc(site.address.line2)}<br>${esc(site.address.country)}</p>
      <p class="footer-text">Enter through Gate 2 — the shop is on the mall side, with parking directly outside the gate.</p>
      <a href="${esc(site.address.mapsUrl)}" class="text-link" target="_blank" rel="noopener">Open in Google Maps →</a>
    </div>
    <div class="visit-block reveal">
      <h3 class="block-title">Before you come</h3>
      <p class="footer-text">Walk in and you'll usually be seen. Book ahead and you sit straight down.</p>
      <div class="hero-actions" style="margin-top:1rem">
        <a href="book.html" class="btn btn-primary">Book a Chair</a>
      </div>
      <p class="footer-text" style="margin-top:1rem"><a href="tel:${esc(site.phoneHref)}">${esc(site.phoneDisplay)}</a></p>
    </div>
  </div>

  <div class="map-frame reveal">
    <iframe
      src="${esc(site.address.mapsEmbed)}"
      title="Map showing ${esc(site.name)} at ${esc(site.address.line1)}"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen></iframe>
  </div>
</section>

<section class="section-narrow" data-rail="Worth Knowing">
  ${sectionHead('While you are here', 'Worth <em>knowing</em>')}
  <div class="offer-list">
    <article class="offer-row reveal">
      <h3>Parking</h3>
      <p>Mall parking sits right by Gate 2 — you'll be a minute's walk from the chair.</p>
    </article>
    <article class="offer-row reveal">
      <h3>Busy stretches</h3>
      <p>Thursday evenings and weekends fill first. Weekday mornings are the quietest.</p>
    </article>
    <article class="offer-row reveal">
      <h3>Running late?</h3>
      <p><a class="text-link" href="${esc(waLink(site, 'Hi, I have a booking and I am running a few minutes late.'))}" target="_blank" rel="noopener">Send a message</a> and we'll hold the chair where we can.</p>
    </article>
  </div>
</section>

${ctaStrip(site, 'See you <em>soon</em>', 'Book a chair before you set off and skip the wait entirely.')}
`,
  };
}
