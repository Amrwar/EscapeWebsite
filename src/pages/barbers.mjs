import { teamGrid, ctaStrip, sectionHead, divider } from '../../tools/components.mjs';

export default function barbers(site) {
  return {
    file: 'barbers.html',
    title: `The Barbers — ${site.name}`,
    description:
      'Meet the barbers at Escape Barbershop — who does fades, who does beards, who does colour, and how to book the one you want.',
    body: `
<section class="page-header">
  <p class="eyebrow center">The team</p>
  <h1>The hands on <em>the clippers</em></h1>
  <p>Regulars book by name. If you're new, tell us what you're after and we'll put you with whoever does it best.</p>
</section>

<section class="section-wide">
  ${teamGrid(site)}
</section>

${divider}

<section class="section-narrow">
  ${sectionHead('How we work', 'The same standard <em>in every chair</em>')}
  <div class="offer-list">
    <article class="offer-row reveal">
      <h3>A consultation first</h3>
      <p>Before anything is switched on, we talk about the shape you want and what your hair will actually hold.</p>
    </article>
    <article class="offer-row reveal">
      <h3>Clean tools, every time</h3>
      <p>Blades sharpened, guards cleaned between clients, fresh towels. Not a selling point — the baseline.</p>
    </article>
    <article class="offer-row reveal">
      <h3>Finished, not just cut</h3>
      <p>Every service ends with a razor edge and a style you can repeat at home without a full kit.</p>
    </article>
  </div>
</section>

${ctaStrip(site, 'Book the chair you <em>trust</em>', 'Pick a barber on the booking form and the request goes in with their name on it.')}
`,
  };
}
