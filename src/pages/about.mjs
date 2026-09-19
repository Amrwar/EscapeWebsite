import { esc } from '../../tools/layout.mjs';
import { ctaStrip, divider, sectionHead, teamGrid } from '../../tools/components.mjs';

export default function about(site) {
  return {
    file: 'about.html',
    title: `Our Story — ${site.name}`,
    description:
      'How Escape Barbershop came to be, what we care about in the chair, and the standard every service is held to.',
    body: `
<section class="page-header">
  <p class="eyebrow center">About</p>
  <h1>Built as <em>an escape</em></h1>
  <p>A barbershop in Mivida for people who want the half hour to be worth something.</p>
</section>

<section class="about">
  <div class="about-media reveal">
    <div class="about-frame">
      <div class="frame-inner">
        <img src="images/entrance-lights.jpg" alt="Entrance with pendant lighting" loading="lazy" width="900" height="600">
      </div>
    </div>
  </div>
  <div class="about-copy reveal">
    <p class="eyebrow">The idea</p>
    <h2>A room that <em>slows you down</em></h2>
    <p>Most grooming is a queue and a countdown. We wanted the opposite: low light, a proper chair, hot towels, and a barber who asks what you want before touching your hair.</p>
    <p>The shop was fitted out with that in mind — pendant lighting over every station, dark surfaces that keep the room calm, and enough space between chairs that you're not sitting in someone else's appointment.</p>
  </div>
</section>

<section class="stats reveal">
  <div class="stat"><strong data-count="26">0</strong><span>services on the menu</span></div>
  <div class="stat"><strong data-count="7">0</strong><span>days open each week</span></div>
  <div class="stat"><strong data-count="4">0</strong><span>barbers in the chairs</span></div>
  <div class="stat"><strong data-count="100" data-suffix="%">0</strong><span>finished with a razor edge</span></div>
</section>

${divider}

<section class="about reversed">
  <div class="about-media reveal">
    <div class="about-frame">
      <div class="frame-inner">
        <img src="images/wash-station.jpg" alt="Wash basin station" loading="lazy" width="900" height="600">
      </div>
    </div>
  </div>
  <div class="about-copy reveal">
    <p class="eyebrow">The standard</p>
    <h2>Detail is the <em>whole job</em></h2>
    <p>Anyone can take length off. The difference is in the line at the neck, the blend at the temple, and whether the shape still works a fortnight later when you haven't touched it.</p>
    <p>So every service ends with a straight-razor finish, every beard gets a hot towel, and nobody is rushed out of the chair to make a number.</p>
    <a class="text-link" href="services.html">See what that covers →</a>
  </div>
</section>

${divider}

<section class="section-wide">
  ${sectionHead('The team', 'Who you&rsquo;ll <em>sit with</em>')}
  ${teamGrid(site, { compact: true })}
</section>

${ctaStrip(site, 'Come see if it <em>holds up</em>', `Book a chair, or drop into ${esc(site.address.line1)} and ask for whoever is free.`)}
`,
  };
}
