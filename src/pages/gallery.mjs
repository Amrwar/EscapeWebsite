import { galleryGrid, gallery, ctaStrip } from '../../tools/components.mjs';

export default function galleryPage(site) {
  return {
    file: 'gallery.html',
    title: `Gallery — ${site.name}`,
    description: 'Inside Escape Barbershop — the shop, the chairs and the stations, shot on site.',
    body: `
<section class="page-header">
  <p class="eyebrow center">Gallery</p>
  <h1>Inside <em>Escape</em></h1>
  <p>Tap any photo to open it full size. Use ← and → to move through them.</p>
</section>

<section class="gallery">
  ${galleryGrid({ items: gallery(site) })}
</section>

${ctaStrip(site, 'Better in <em>person</em>', 'The lighting, the leather and the quiet do not photograph. Come and sit in it.')}
`,
  };
}
