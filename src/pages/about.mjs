import { esc } from '../../tools/layout.mjs';
import { ctaStrip, sectionHead, teamGrid } from '../../tools/components.mjs';

export default function about(site) {
  return {
    file: 'about.html',
    title: `Our Story — ${site.name}`,
    description:
      'How Escape Barbershop came to be, the room it was built into, and the standard every service is held to.',
    bodyClass: 'dark-top',
    body: `
<section class="cover theme-dark" data-rail="About">
  <img class="cover-img" src="images/gallery/the-shop/storefront-at-night.jpg" alt="" aria-hidden="true">
  <div class="cover-overlay" aria-hidden="true"></div>
  <div class="cover-content">
    <p class="eyebrow center">About</p>
    <h1>Built as <em>an escape</em></h1>
    <p>A barbershop in Mivida for people who want the half hour to be worth something.</p>
  </div>
</section>

<section class="section-wide" data-rail="The Idea">
  <div class="lead-grid">
    <div class="lead reveal">
      <p>Most grooming is a queue and a countdown. Escape was built for the opposite — a room you don't mind waiting in, a chair that lets your shoulders drop, and a barber who asks what you want before anything is switched on.</p>
      <p>The fit-out says it before anyone does: pale concrete walls, black steel, arched mirrors, a run of light across the ceiling, and enough space between chairs that you're never sitting in someone else's appointment. There's a sofa by the window and a pedicure area at the back, because a visit here isn't only about the top of your head.</p>
    </div>
    <aside class="fact-panel reveal">
      <h2 class="block-title">The short version</h2>
      <ul class="fact-list">
        <li><span>Where</span><span>${esc(site.address.line2)}</span></li>
        <li><span>Address</span><span>${esc(site.address.line1)}</span></li>
        <li><span>Barbers</span><span>${site.team.length}</span></li>
        <li><span>Services</span><span>${site.services.length}</span></li>
        <li><span>Open</span><span>7 days a week</span></li>
      </ul>
      <a class="text-link" href="visit.html">Hours &amp; directions →</a>
    </aside>
  </div>
</section>

<section class="pullquote-band theme-dark">
  <blockquote class="pullquote reveal">
    <p>Where a cut becomes <em>an escape</em>.</p>
    <footer>The line on the door, and the brief for the whole room</footer>
  </blockquote>
</section>

<section class="about stack" data-rail="The Mark">
  <div class="about-media reveal">
    <div class="stack-frame stack-back">
      <img src="images/gallery/details/climbers-on-the-wall.jpg" alt="Two climbing figures mounted on the shop wall, lit from above" loading="lazy" width="1200" height="900">
    </div>
    <div class="stack-frame stack-front">
      <img src="images/gallery/the-shop/reception-desk.jpg" alt="The reception desk in stone, under the shop's wordmark" loading="lazy" width="900" height="1200">
    </div>
  </div>
  <div class="about-copy reveal">
    <p class="eyebrow">The mark</p>
    <h2>Two climbers,<br><em>one wall</em></h2>
    <p>The figure in the logo is a climber, and inside the shop two of them scale the concrete above the sofa, lit from the track overhead. It's the clearest way to say what the name means: getting out of the day for a while, then coming back sharper.</p>
    <p>The same idea runs through the rest of the fit-out — the stone reception, the arched mirrors, the low light at the back. Nothing shouts. It's a room you can sit in.</p>
    <a class="text-link" href="gallery.html">See the room →</a>
  </div>
</section>

<section class="stats theme-dark reveal">
  <div class="stat"><strong data-count="${site.services.length}">0</strong><span>services on the menu</span></div>
  <div class="stat"><strong data-count="7">0</strong><span>days open each week</span></div>
  <div class="stat"><strong data-count="${site.team.length}">0</strong><span>barbers in the chairs</span></div>
  <div class="stat"><strong data-count="100" data-suffix="%">0</strong><span>finished with a razor edge</span></div>
</section>

<section class="section-narrow" data-rail="The Standard">
  ${sectionHead('The standard', 'Detail is the <em>whole job</em>', 'Anyone can take length off. The difference is what the cut looks like a fortnight later.')}
  <ol class="craft-list">
    <li class="craft-step reveal">
      <span class="craft-num">01</span>
      <div>
        <h3>The consultation is part of the cut</h3>
        <p>What shape you want, how you wear it during the week, and what your hair will actually hold — settled before the clippers come out.</p>
      </div>
    </li>
    <li class="craft-step reveal">
      <span class="craft-num">02</span>
      <div>
        <h3>Clean tools, every client</h3>
        <p>Blades sharpened rather than swapped out, guards cleaned between clients, fresh towels each time.</p>
      </div>
    </li>
    <li class="craft-step reveal">
      <span class="craft-num">03</span>
      <div>
        <h3>A razor edge to finish</h3>
        <p>The neck, the temple, the line at the ear. The last five minutes are what people notice for the next two weeks.</p>
      </div>
    </li>
    <li class="craft-step reveal">
      <span class="craft-num">04</span>
      <div>
        <h3>Nobody is rushed out of the chair</h3>
        <p>A cut takes half an hour because that's how long it takes. Treatments take as long as they take.</p>
      </div>
    </li>
  </ol>
</section>

<section class="about reversed" data-rail="The Shelf">
  <div class="about-media reveal">
    <div class="about-frame">
      <div class="frame-inner">
        <img src="images/gallery/details/cosmetics-shelf.jpg" alt="Kérastase and L'Oréal products on the shop's cosmetics shelf" loading="lazy" width="1200" height="900">
      </div>
    </div>
  </div>
  <div class="about-copy reveal">
    <p class="eyebrow">The shelf</p>
    <h2>What we <em>put on your hair</em></h2>
    <p>Kérastase and L'Oréal on the shelf, not whatever was cheapest that month — for the oil baths, the protein treatments and the colour work as much as for what goes in at the end.</p>
    <p>If something suits your hair, the barber will tell you which one and how much to use. If nothing does, they'll tell you that too.</p>
    <a class="text-link" href="services.html">The full menu →</a>
  </div>
</section>

<section class="section-wide" data-rail="The Team">
  ${sectionHead('The team', 'Who you&rsquo;ll <em>sit with</em>')}
  ${teamGrid(site, { compact: true })}
  <div class="hero-actions center" style="margin-top:2.5rem">
    <a class="btn btn-ghost" href="behind-the-chair.html">Meet the Barbers</a>
  </div>
</section>

${ctaStrip(site, 'Come see if it <em>holds up</em>', `Book a chair, or drop into ${esc(site.address.line1)} and ask for whoever is free.`)}
`,
  };
}
