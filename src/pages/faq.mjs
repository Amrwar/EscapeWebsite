import { esc } from '../../tools/layout.mjs';
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
  <p>If yours isn't here, <a class="text-link" href="contact.html">ask us directly</a> — we answer fast.</p>
</section>

<section class="section-narrow">
  ${faqList(site)}
</section>

${ctaStrip(site, 'Answered? <em>Take a chair.</em>', `Book online, or call ${esc(site.phoneDisplay)} and we'll sort it in a minute.`)}
`,
  };
}
