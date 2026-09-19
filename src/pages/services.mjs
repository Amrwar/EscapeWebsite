import { esc } from '../../tools/layout.mjs';
import { serviceMenu, ctaStrip, divider, sectionHead, faqList } from '../../tools/components.mjs';

export default function services(site) {
  return {
    file: 'services.html',
    title: `Services & Prices — ${site.name}`,
    description:
      'The full menu at Escape Barbershop — cuts, beard sculpting, colour, protein, oil baths and waxing, with times for every service.',
    body: `
<section class="page-header">
  <p class="eyebrow center">The menu</p>
  <h1>Crafted, <em>not rushed</em></h1>
  <p>Twenty-six services, each with the time it really takes. Filter by what you're after, or search the list.</p>
</section>

<section class="services">
  ${serviceMenu(site)}
  <div class="hero-actions center" style="margin-top:2.5rem">
    <a href="book.html" class="btn btn-primary">Book a Service</a>
    <button type="button" class="btn btn-ghost" id="printMenu">Print the Menu</button>
  </div>
</section>

${divider}

<section class="section-narrow">
  ${sectionHead('Good to know', 'Before you <em>sit down</em>')}
  ${faqList(site, 4)}
  <div class="hero-actions center" style="margin-top:2.5rem">
    <a href="faq.html" class="btn btn-ghost">All Questions</a>
  </div>
</section>

${ctaStrip(
  site,
  'Know what you want? <em>Take the chair.</em>',
  `Pick your service and barber, and we'll confirm on WhatsApp. Or call ${esc(site.phoneDisplay)}.`
)}
`,
  };
}
