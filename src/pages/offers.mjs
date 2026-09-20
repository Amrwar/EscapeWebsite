import { esc, waLink } from '../../tools/layout.mjs';
import { packageCards, ctaStrip, sectionHead, cover } from '../../tools/components.mjs';

export default function offers(site) {
  return {
    file: 'offers.html',
    title: `Packages & Offers — ${site.name}`,
    description:
      'Groom packages, the full Escape sitting, and standing offers for regulars at Escape Barbershop in Mivida, New Cairo.',
    bodyClass: 'dark-top',
    body: `
${cover({
  eyebrow: 'Packages & offers',
  title: 'More than <em>one service</em>',
  sub: 'Sittings built to be booked together — for a wedding, a reset, or the visit you have been putting off.',
  image: 'gallery/the-chairs/mirror-arches.jpg',
})}

<section class="section-wide" data-rail="Packages">
  ${packageCards(site)}
</section>

<section class="section-narrow" data-rail="Standing Offers">
  ${sectionHead('Standing offers', 'For the <em>regulars</em>')}
  <div class="offer-list">
    <article class="offer-row reveal">
      <h3>Bring someone new</h3>
      <p>Come in with a first-timer and we look after you both — mention it at the desk when you arrive.</p>
    </article>
    <article class="offer-row reveal">
      <h3>Father &amp; son</h3>
      <p>Book a cut and a kids' cut back to back and they run as one sitting, so nobody waits around.</p>
    </article>
    <article class="offer-row reveal">
      <h3>Quiet hours</h3>
      <p>Weekday mornings are the calmest stretch in the shop. Same work, no queue, the room to yourself.</p>
    </article>
    <article class="offer-row reveal">
      <h3>Groom parties</h3>
      <p>Booking for the whole party? Message us and we'll block out the chairs you need in one go.</p>
    </article>
  </div>
  <p class="menu-footnote">Ask about the current terms when you book — <a href="${esc(waLink(site, 'Hi, could you tell me more about your packages and offers?'))}" target="_blank" rel="noopener">message us on WhatsApp</a>.</p>
</section>

${ctaStrip(site, 'Planning something <em>bigger?</em>', 'Tell us the date and how many chairs you need, and we will hold them.')}
`,
  };
}
