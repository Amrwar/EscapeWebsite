import { esc } from '../../tools/layout.mjs';
import { reviewWall, ctaStrip, sectionHead, cover } from '../../tools/components.mjs';

export default function reviews(site) {
  return {
    file: 'reviews.html',
    title: `Reviews — ${site.name}`,
    description: 'What people say about Escape Barbershop, and where to leave your own word.',
    bodyClass: 'dark-top',
    body: `
${cover({
  eyebrow: 'Reviews',
  title: 'Said by <em>the chair</em>',
  sub: 'Every word here comes from a real customer. Nothing is written in-house.',
  image: 'gallery/the-chairs/chair-row.jpg',
})}

<section class="section-narrow reviews-section" data-rail="Reviews">
  ${reviewWall(site)}
</section>

<section class="section-narrow" data-rail="Leave Yours">
  ${sectionHead('Leave yours', 'Sat in one of our chairs?')}
  <p class="section-sub">A line on Google takes thirty seconds and decides where somebody in Mivida gets their next cut. If something was off, tell us first — we would rather fix it than read about it.</p>
  <div class="hero-actions center" style="margin-top:2rem">
    <a class="btn btn-primary" href="${esc(site.googleReviewsUrl)}" target="_blank" rel="noopener">Write a Google Review</a>
    <a class="btn btn-ghost" href="contact.html">Tell us privately</a>
  </div>
</section>

${ctaStrip(site, 'Judge it for <em>yourself</em>', 'Book a chair and see whether the reviews hold up.')}
`,
  };
}
