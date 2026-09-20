import { esc, waLink } from '../../tools/layout.mjs';
import { faqList, ctaStrip } from '../../tools/components.mjs';

export default function faq(site) {
  return {
    file: 'faq.html',
    title: `Questions — ${site.name}`,
    description:
      'Appointments, walk-ins, prices, children, payment, weddings and parking — the questions we get asked at Escape Barbershop.',
    body: `
<section class="page-header">
  <p class="eyebrow center">Questions</p>
  <h1>Asked <em>often</em></h1>
  <p>Ten things people ask before their first visit. If yours isn't here, ask us — we answer fast.</p>
</section>

<section class="section-wide" data-rail="Questions">
  <div class="faq-layout">
    <div class="faq-main">
      ${faqList(site)}
    </div>
    <aside class="faq-aside">
      <div class="aside-block reveal">
        <h3 class="block-title">Still stuck?</h3>
        <p class="footer-text">Ask the shop directly — someone at the desk will answer while you wait.</p>
        <a class="btn btn-primary" href="${esc(waLink(site, 'Hi, I have a question about your services:'))}" target="_blank" rel="noopener">Ask on WhatsApp</a>
        <a class="btn btn-ghost" href="tel:${esc(site.phoneHref)}">Call ${esc(site.phoneDisplay)}</a>
      </div>
      <div class="aside-block reveal">
        <h3 class="block-title">Know what you want?</h3>
        <p class="footer-text">Pick a service and a time and we'll confirm it by reply.</p>
        <a class="btn btn-ghost" href="book.html">Book a Chair</a>
      </div>
    </aside>
  </div>
</section>

${ctaStrip(site, 'Answered? <em>Take a chair.</em>', `Book online, or call ${esc(site.phoneDisplay)} and we'll sort it in a minute.`)}
`,
  };
}
