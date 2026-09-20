import { esc } from '../../tools/layout.mjs';
import { teamGrid, ctaStrip, sectionHead, cover } from '../../tools/components.mjs';

/**
 * The team page. Portraits come from images/team/ — drop a file in and it
 * appears; until then each card shows a monogram plate, so the page never looks
 * half-finished while we wait for photographs.
 */
export default function behindTheChair(site) {
  return {
    file: 'behind-the-chair.html',
    title: `Behind the Chair — ${site.name}`,
    description:
      'The barbers at Escape Barbershop — who does fades, who does beards, who does colour, and how to book the one you want.',
    bodyClass: 'dark-top',
    body: `
${cover({
  eyebrow: 'Behind the chair',
  title: 'The hands on <em>the clippers</em>',
  sub: "Regulars book by name. If you're new, tell us what you're after and we'll put you with whoever does it best.",
  image: 'gallery/the-chairs/in-the-chair.jpg',
})}

<section class="section-wide" data-rail="The Barbers">
  ${teamGrid(site)}
</section>

<section class="section-narrow" data-rail="The Standard">
  ${sectionHead('The standard', 'The same work <em>in every chair</em>', 'Four barbers, one way of doing things.')}
  <ol class="craft-list">
    <li class="craft-step reveal">
      <span class="craft-num">01</span>
      <div>
        <h3>We ask first</h3>
        <p>Before anything is switched on: what shape you want, how you wear it during the week, and what your hair will actually hold. Two minutes that save a fortnight of regret.</p>
      </div>
    </li>
    <li class="craft-step reveal">
      <span class="craft-num">02</span>
      <div>
        <h3>Clean tools, every client</h3>
        <p>Blades sharpened rather than swapped out, guards cleaned between clients, fresh towels each time. Not a selling point — the baseline.</p>
      </div>
    </li>
    <li class="craft-step reveal">
      <span class="craft-num">03</span>
      <div>
        <h3>The finish is the job</h3>
        <p>A razor edge at the neck, a clean line at the temple, and a hot towel to close. The last five minutes are what people notice for the next two weeks.</p>
      </div>
    </li>
    <li class="craft-step reveal">
      <span class="craft-num">04</span>
      <div>
        <h3>You leave knowing how to keep it</h3>
        <p>Which product, how much, and how to get the same shape at home without a full kit on the shelf.</p>
      </div>
    </li>
  </ol>
</section>

<section class="section-narrow" data-rail="Who to Ask For">
  ${sectionHead('Not sure who to ask for', 'Pick by <em>what you want</em>')}
  <div class="pick-grid">
    ${site.team
      .map(
        (m) => `<a class="pick-card reveal" href="book.html?barber=${encodeURIComponent(m.name)}">
      <span class="pick-focus">${esc((m.focus ?? [])[0] ?? m.role)}</span>
      <strong>${esc(m.name)}</strong>
      <span class="pick-role">${esc(m.role)}</span>
    </a>`
      )
      .join('\n    ')}
  </div>
  <p class="menu-footnote">No preference? Leave the barber field empty when you book and we'll put you with whoever is free soonest.</p>
</section>

${ctaStrip(site, 'Book the chair you <em>trust</em>', 'Pick a barber on the form and the request goes in with their name on it.')}
`,
  };
}
