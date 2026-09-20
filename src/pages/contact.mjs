import { esc, socialLinks } from '../../tools/layout.mjs';
import { contactCards, ctaStrip, hoursTable, sectionHead } from '../../tools/components.mjs';

export default function contact(site) {
  const socials = socialLinks(site, 'social-icons large');
  return {
    file: 'contact.html',
    title: `Contact — ${site.name}`,
    description: `Call, WhatsApp, email or visit ${site.name} — ${site.address.line1}, ${site.address.line2}.`,
    body: `
<section class="page-header">
  <p class="eyebrow center">Contact</p>
  <h1>Talk to <em>the shop</em></h1>
  <p>Whichever of these you use, it reaches the same people — the ones holding the clippers.</p>
</section>

<section class="section-wide" data-rail="Contact">
  ${contactCards(site)}
</section>

<section class="section-wide" data-rail="Find Us">
  <div class="contact-split">
    <div class="reveal">
      <h3 class="block-title">Where we are</h3>
      <a class="footer-map" href="${esc(site.address.mapsUrl)}" target="_blank" rel="noopener">
        <img src="images/gallery/the-shop/reception-desk.jpg" alt="The reception desk at Escape Barbershop" loading="lazy" width="900" height="600">
        <span>Open in Maps →</span>
      </a>
      <p class="footer-text">${esc(site.address.line1)}<br>${esc(site.address.line2)}, ${esc(site.address.country)}</p>
      <h3 class="block-title" style="margin-top:2rem">Email</h3>
      <p class="footer-text">For anything that isn't urgent — packages, events, working with us.</p>
      <p><a class="text-link" href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
      ${socials ? `<h3 class="block-title" style="margin-top:2.2rem">Follow the work</h3>${socials}` : ''}
    </div>
    <div class="reveal">
      <div class="hours-panel">
        <h3 class="block-title">When we're in</h3>
        ${hoursTable(site)}
        <p class="status-inline" id="statusInline">Checking today's hours…</p>
      </div>
      <div class="aside-block reveal" style="margin-top:1.25rem">
        <h3 class="block-title">Prefer to book?</h3>
        <p class="footer-text">The form takes a minute and reaches us the same way.</p>
        <a class="btn btn-primary" href="book.html">Book a Chair</a>
      </div>
    </div>
  </div>
</section>

${ctaStrip(site, 'Or just <em>book it</em>', 'Pick a service and a time — we confirm by reply.')}
`,
  };
}
