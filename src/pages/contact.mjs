import { esc, socialLinks } from '../../tools/layout.mjs';
import { contactCards, ctaStrip, hoursTable, divider, sectionHead } from '../../tools/components.mjs';

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

<section class="section-wide">
  ${contactCards(site)}
</section>

${divider}

<section class="section-narrow">
  <div class="contact-split">
    <div class="reveal">
      <h3 class="block-title">Email</h3>
      <p class="footer-text">For anything that isn't urgent — packages, events, working with us.</p>
      <p><a class="text-link" href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
      ${socials ? `<h3 class="block-title" style="margin-top:2.4rem">Follow the work</h3>${socials}` : ''}
    </div>
    <div class="reveal">
      <h3 class="block-title">When we're in</h3>
      ${hoursTable(site, { compact: true })}
      <p class="status-inline" id="statusInline">Checking today's hours…</p>
    </div>
  </div>
</section>

${ctaStrip(site, 'Or just <em>book it</em>', 'The booking form takes a minute and reaches us the same way.')}
`,
  };
}
