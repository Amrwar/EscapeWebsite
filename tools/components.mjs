/**
 * Blocks that more than one page needs: the service menu, the hours table, the
 * FAQ, the team, packages and reviews. Each one is built from site.config.json,
 * so the shop edits data in one place and every page that shows it follows.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc, pretty, waLink, icon } from './layout.mjs';
import { teamPhotos, galleryPhotos, slug } from './photos.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const sectionHead = (eyebrow, heading, sub = '') => `
  <div class="section-head reveal">
    <p class="eyebrow center">${esc(eyebrow)}</p>
    <h2 class="center">${heading}</h2>
    ${sub ? `<p class="section-sub">${sub}</p>` : ''}
  </div>`;

/**
 * A page opening on a photo rather than plain paper. `image` is a path under
 * images/; the caller adds `bodyClass: 'dark-top'` so the header goes light
 * over it.
 */
export function cover({ eyebrow, title, sub, image, alt = '' }) {
  return `
<section class="cover theme-dark" data-rail="${esc(eyebrow)}">
  <img class="cover-img" src="images/${image}" alt="${esc(alt)}"${alt ? '' : ' aria-hidden="true"'}>
  <div class="cover-overlay" aria-hidden="true"></div>
  <div class="cover-content">
    <p class="eyebrow center">${esc(eyebrow)}</p>
    <h1>${title}</h1>
    ${sub ? `<p>${sub}</p>` : ''}
  </div>
</section>`;
}

export const divider = '<div class="divider" aria-hidden="true"><span>✦</span></div>';

export function ctaStrip(site, heading, sub) {
  return `
<section class="cta-strip theme-dark" id="book">
  <div class="cta-inner reveal">
    <p class="eyebrow center">Book your visit</p>
    <h2>${heading}</h2>
    <p>${sub}</p>
    <div class="hero-actions center">
      <a href="book.html" class="btn btn-primary">Book an Appointment</a>
      <a href="tel:${esc(site.phoneHref)}" class="btn btn-ghost">Call ${esc(site.phoneDisplay)}</a>
    </div>
    <p class="cta-note">Walk-ins welcome — booking ahead just saves you the wait.</p>
  </div>
</section>`;
}

/** Price column only appears once at least one price is filled in. */
export const hasPrices = (site) =>
  site.services.some((s) => s.price != null) || site.packages.some((p) => p.price != null);

const money = (site, value) => `${value} ${site.currency}`;

/** The photo that follows the cursor when you run down the menu. */
const GROUP_PREVIEW = {
  Hair: 'images/gallery/the-chairs/in-the-chair.jpg',
  Beard: 'videos/reel-treatment-poster.jpg',
  'Colour & Treatments': 'images/gallery/details/cosmetics-shelf.jpg',
  Packages: 'images/gallery/the-chairs/mirror-arches.jpg',
  Extras: 'images/gallery/details/tools-trolley.jpg',
};

/**
 * The menu, laid out like a printed card: a sticky panel on the left that shows
 * the room the service happens in, and the list on the right, grouped under its
 * own headings. The preview is pinned rather than following the cursor — it was
 * covering the very rows you were reading.
 */
export function serviceMenu(site, { filters = true } = {}) {
  const showPrices = hasPrices(site);
  const groups = site.serviceGroups.filter((g) => site.services.some((s) => s.group === g));
  const firstGroup = groups[0];

  const toolbar = filters
    ? `
  <div class="menu-tools reveal">
    <div class="filter-row" role="tablist" aria-label="Filter services">
      <button class="chip is-active" data-filter="all" role="tab" aria-selected="true">All <span>${site.services.length}</span></button>
      ${groups
        .map(
          (g) =>
            `<button class="chip" data-filter="${esc(g)}" role="tab" aria-selected="false">${esc(g)} <span>${site.services.filter((s) => s.group === g).length}</span></button>`
        )
        .join('\n      ')}
    </div>
    <label class="search-field">
      <span class="visually-hidden">Search services</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>
      <input type="search" id="serviceSearch" placeholder="Search the menu…" autocomplete="off">
    </label>
  </div>
  <p class="filter-empty" id="filterEmpty" hidden>Nothing on the menu matches that — try another word, or <a href="contact.html">ask us</a>.</p>`
    : '';

  let index = 0;
  const groupBlocks = groups
    .map((group) => {
      const inGroup = site.services.filter((s) => s.group === group);
      const rows = inGroup
        .map((s) => {
          index += 1;
          const n = String(index).padStart(2, '0');
          return `      <article class="menu-row reveal" data-group="${esc(s.group)}" data-name="${esc(`${s.name} ${s.ar ?? ''}`)}" data-preview="${esc(GROUP_PREVIEW[s.group] ?? '')}" data-service="${esc(s.name)}" data-minutes="${s.minutes}">
        <span class="menu-num">${n}</span>
        <div class="menu-body">
          <h3>${esc(s.name)}${s.ar ? ` <span class="menu-ar" lang="ar" dir="rtl">${esc(s.ar)}</span>` : ''}</h3>
          <p>${esc(s.blurb ?? '')}</p>
        </div>
        <div class="menu-meta">
          <span class="menu-time">${s.minutes} min</span>
          ${showPrices ? `<span class="menu-price">${s.price == null ? 'On request' : esc(money(site, s.price))}</span>` : ''}
        </div>
        <a class="menu-book" href="book.html?service=${encodeURIComponent(s.name)}" aria-label="Book ${esc(s.name)}">Book <span aria-hidden="true">→</span></a>
      </article>`;
        })
        .join('\n');
      return `    <section class="menu-group" data-group-block="${esc(group)}">
      <header class="group-head">
        <h3>${esc(group)}</h3>
        <span class="group-count">${inGroup.length} ${inGroup.length === 1 ? 'service' : 'services'}</span>
      </header>
${rows}
    </section>`;
    })
    .join('\n');

  return `${toolbar}
  <div class="menu-layout">
    <aside class="menu-aside" aria-hidden="true">
      <figure class="menu-preview-card" id="menuPreview">
        <img src="${esc(GROUP_PREVIEW[firstGroup] ?? '')}" alt="" id="menuPreviewImg" loading="lazy">
        <figcaption>
          <span class="preview-kicker" id="menuPreviewKicker">${esc(firstGroup ?? '')}</span>
          <strong id="menuPreviewTitle">The room it happens in</strong>
          <span class="preview-meta" id="menuPreviewMeta">Hover a service to see where</span>
        </figcaption>
      </figure>
      <a class="btn btn-primary" href="book.html">Book a Service</a>
    </aside>
    <div class="menu-list" id="menuList">
${groupBlocks}
    </div>
  </div>
  ${
    showPrices
      ? ''
      : `<p class="menu-footnote">Prices depend on hair length and the products used — <a href="tel:${esc(site.phoneHref)}">call the shop</a> or <a href="${esc(waLink(site, 'Hi, could you send me your current price list?'))}" target="_blank" rel="noopener">ask on WhatsApp</a> for today's list.</p>`
  }`;
}

export function featuredServices(site) {
  const featured = site.services.filter((s) => s.featured).slice(0, 3);
  return `
  <div class="feature-grid">
    ${featured
      .map(
        (s, i) => `<article class="feature-card reveal">
      <span class="feature-num">0${i + 1}</span>
      <h3>${esc(s.name)}</h3>
      <p>${esc(s.blurb ?? '')}</p>
      <span class="feature-time">${s.minutes} minutes</span>
      <a class="text-link" href="book.html?service=${encodeURIComponent(s.name)}">Book this →</a>
    </article>`
      )
      .join('\n    ')}
  </div>`;
}

export function hoursTable(site, { compact = false } = {}) {
  const rows = site.hours
    .map(
      (d, i) =>
        `<li data-weekday="${i}"><span>${esc(d.day)}</span><span>${d.open ? `${pretty(d.open)} – ${pretty(d.close)}` : 'Closed'}</span></li>`
    )
    .join('\n      ');
  return `<ul class="hours-list${compact ? ' compact' : ''}" data-hours-list>
      ${rows}
    </ul>`;
}

export function packageCards(site) {
  const showPrices = hasPrices(site);
  return `
  <div class="package-grid">
    ${site.packages
      .map(
        (p) => `<article class="package-card reveal">
      ${p.highlight ? `<span class="package-flag">${esc(p.highlight)}</span>` : ''}
      <h3>${esc(p.name)}${p.ar ? ` <span class="menu-ar" lang="ar" dir="rtl">${esc(p.ar)}</span>` : ''}</h3>
      <p>${esc(p.blurb)}</p>
      <ul class="tick-list">
        ${p.includes.map((item) => `<li>${esc(item)}</li>`).join('\n        ')}
      </ul>
      ${showPrices && p.price != null ? `<p class="package-price">${esc(money(site, p.price))}</p>` : ''}
      <a class="btn btn-ghost" href="book.html?service=${encodeURIComponent(p.name)}">Enquire &amp; Book</a>
    </article>`
      )
      .join('\n    ')}
  </div>`;
}

/**
 * The team. Portraits are found on disk (images/team/<name>.jpg) rather than
 * listed in the config, so adding a photo is just dropping the file in. Until
 * one exists, the card shows a monogram plate instead of a broken frame.
 *
 * `compact` is the shorter card used on pages where the team isn't the subject.
 */
export function teamGrid(site, { compact = false } = {}) {
  const portraits = teamPhotos(ROOT);
  return `
  <div class="team-grid${compact ? ' compact' : ''}">
    ${site.team
      .map((m, i) => {
        const photo = m.photo ?? portraits.get(slug(m.name));
        return `<article class="team-card reveal">
      <div class="team-photo">
        ${
          photo
            ? `<img src="${esc(photo)}" alt="${esc(m.name)}, ${esc(m.role.toLowerCase())} at ${esc(site.name)}" loading="lazy">`
            : `<span class="team-initial" aria-hidden="true">${esc(m.name.slice(0, 1))}</span>`
        }
        <span class="team-index" aria-hidden="true">0${i + 1}</span>
      </div>
      <h3>${esc(m.name)}</h3>
      <p class="team-role">${esc(m.role)}${m.since ? ` · since ${esc(String(m.since))}` : ''}</p>
      <p class="team-specialty">${esc(m.specialty)}</p>
      ${
        !compact && m.focus?.length
          ? `<ul class="team-focus">${m.focus.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>`
          : ''
      }
      ${
        !compact && m.languages?.length
          ? `<p class="team-languages">Speaks ${esc(m.languages.join(' & '))}</p>`
          : ''
      }
      <a class="text-link" href="book.html?barber=${encodeURIComponent(m.name)}">Book with ${esc(m.name)} →</a>
    </article>`;
      })
      .join('\n    ')}
  </div>`;
}

export function faqList(site, limit = site.faq.length) {
  return `
  <div class="faq-list">
    ${site.faq
      .slice(0, limit)
      .map((item, i) => {
        const id = `faq-${i + 1}`;
        return `<div class="faq-item reveal" id="${id}">
      <h3>
        <button class="faq-q" aria-expanded="false" aria-controls="${id}-a" id="${id}-q">
          <span>${esc(item.q)}</span>
          <span class="faq-mark" aria-hidden="true"></span>
        </button>
      </h3>
      <div class="faq-a" id="${id}-a" role="region" aria-labelledby="${id}-q" hidden>
        <p>${esc(item.a)}</p>
      </div>
    </div>`;
      })
      .join('\n    ')}
  </div>`;
}

export function reviewWall(site) {
  if (!site.reviews.length) {
    return `
  <div class="review-empty reveal">
    <span class="stars" aria-hidden="true">★★★★★</span>
    <h3>The chair speaks for itself</h3>
    <p>We'd rather show nothing than show reviews we wrote ourselves. If you've sat in one of our chairs, leave a word on Google — it's read by everyone deciding where to get their next cut.</p>
    <div class="hero-actions center">
      <a class="btn btn-primary" href="${esc(site.googleReviewsUrl)}" target="_blank" rel="noopener">Leave a Google Review</a>
      <a class="btn btn-ghost" href="${esc(waLink(site, 'Hi, I wanted to share some feedback about my visit:'))}" target="_blank" rel="noopener">Tell us directly</a>
    </div>
  </div>`;
  }
  return `
  <div class="review-track" id="reviewTrack">
    ${site.reviews
      .map(
        (r) => `<blockquote class="review-card">
      <span class="stars" aria-label="${r.rating ?? 5} out of 5">${'★'.repeat(r.rating ?? 5)}</span>
      <p>${esc(r.quote)}</p>
      <footer>${esc(r.author)}${r.source ? ` <span>· ${esc(r.source)}</span>` : ''}</footer>
    </blockquote>`
      )
      .join('\n    ')}
  </div>
  <div class="review-dots" id="reviewDots" role="tablist" aria-label="Reviews"></div>`;
}

/** The shop's real aggregate rating from Google, as a stat card. Skipped if either number is missing. */
export function googleRatingCard(site) {
  if (site.googleRating == null || site.googleReviewCount == null) return '';
  return `
  <a class="rating-card reveal" href="${esc(site.googleReviewsUrl)}" target="_blank" rel="noopener">
    <span class="rating-card-eyebrow">On Google</span>
    <span class="rating-card-score">${esc(site.googleRating)}</span>
    <span class="stars" aria-hidden="true">${'★'.repeat(Math.round(site.googleRating))}${'☆'.repeat(5 - Math.round(site.googleRating))}</span>
    <span class="rating-card-count">${esc(site.googleReviewCount)} reviews on Google →</span>
  </a>`;
}

/** The photos that shipped with the site. */
const BASE_GALLERY = [
  { file: 'entrance-lights.jpg', alt: 'Entrance with pendant lighting', group: 'The Shop' },
  { file: 'barber-chairs.jpg', alt: 'Barber chairs lined up along the mirrors', group: 'The Chairs' },
  { file: 'pedicure-area.jpg', alt: 'Pedicure area with dark leather chairs', group: 'The Chairs' },
  { file: 'wash-station.jpg', alt: 'Wash basin station', group: 'Stations' },
];

/**
 * Everything the gallery shows: the photos above, plus anything dropped into
 * images/gallery/<group>/ since. New work lands at the front, because that's
 * what a visitor wants to see first.
 */
export function gallery(site) {
  const dropped = galleryPhotos(ROOT, site.photoCaptions ?? {});
  return [...dropped, ...BASE_GALLERY];
}

/**
 * An art-directed collage rather than a grid of equal squares: the first photo
 * runs tall down the left, the next two stack beside it, and the rest fill the
 * row underneath. It reads like a spread instead of a contact sheet.
 */
export function mosaic(items) {
  return galleryGrid({ filters: false, items, layout: 'mosaic' });
}

export function galleryGrid({ filters = true, items = BASE_GALLERY, layout = 'grid' } = {}) {
  const groups = [...new Set(items.map((i) => i.group))];
  const tabs = filters
    ? `
  <div class="gallery-tools reveal">
    <div class="filter-row" role="tablist" aria-label="Filter photos">
      <button class="chip is-active" data-gallery-filter="all" role="tab" aria-selected="true">Everything <span>${items.length}</span></button>
      ${groups
        .map(
          (g) =>
            `<button class="chip" data-gallery-filter="${esc(g)}" role="tab" aria-selected="false">${esc(g)} <span>${items.filter((i) => i.group === g).length}</span></button>`
        )
        .join('\n      ')}
    </div>
    <p class="gallery-hint">Click any photo to open it full size</p>
  </div>`
    : '';
  const tiles = items
    .map(
      (img, i) => `    <button class="gallery-item reveal" data-group="${esc(img.group)}" data-index="${i}" aria-label="Open photo: ${esc(img.alt)}">
      <img src="images/${img.file}" alt="${esc(img.alt)}" loading="lazy" width="800" height="600">
      <span class="gallery-caption">
        <span class="gallery-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="gallery-group">${esc(img.group)}</span>
      </span>
    </button>`
    )
    .join('\n');
  return `${tabs}
  <div class="gallery-grid${layout === 'mosaic' ? ' is-mosaic' : ' is-editorial'}" id="galleryGrid">
${tiles}
  </div>
  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" hidden>
    <button class="lightbox-close" id="lightboxClose" aria-label="Close viewer">✕</button>
    <button class="lightbox-nav prev" id="lightboxPrev" aria-label="Previous photo">‹</button>
    <figure class="lightbox-figure">
      <img id="lightboxImg" src="" alt="">
      <figcaption id="lightboxCaption"></figcaption>
    </figure>
    <button class="lightbox-nav next" id="lightboxNext" aria-label="Next photo">›</button>
    <div class="lightbox-rail" id="lightboxRail" aria-hidden="true"></div>
  </div>`;
}

/**
 * The film strip: short silent clips shot in the shop. They only load when
 * they're about to be seen and they play muted, so the page stays quiet and
 * light until someone scrolls this far.
 */
export const REELS = [
  { file: 'reel-cut', title: 'The cut', caption: 'Clipper work, chair four' },
  { file: 'reel-treatment', title: 'The treatment', caption: 'Steam, mask, reset' },
  { file: 'reel-chair', title: 'The chair', caption: 'Where the half hour goes' },
  { file: 'reel-arrival', title: 'The arrival', caption: 'Pulling up at Gate 2' },
];

export function filmStrip(reels = REELS) {
  return `
  <div class="reel-grid">
    ${reels
      .map(
        (r) => `<figure class="reel-card reveal">
      <video
        src="videos/${r.file}.mp4"
        poster="videos/${r.file}-poster.jpg"
        muted loop playsinline preload="none"
        aria-label="${esc(r.title)} — ${esc(r.caption)}"
        data-autoplay></video>
      <figcaption class="reel-label">
        <strong>${esc(r.title)}</strong>
        <span>${esc(r.caption)}</span>
      </figcaption>
    </figure>`
      )
      .join('\n    ')}
  </div>`;
}

export function contactCards(site) {
  const cards = [
    {
      icon: icon.phone,
      title: 'Call the shop',
      body: `<a href="tel:${esc(site.phoneHref)}">${esc(site.phoneDisplay)}</a>`,
      note: 'Fastest way to grab a same-day chair.',
    },
    {
      icon: icon.whatsapp,
      title: 'WhatsApp',
      body: `<a href="${esc(waLink(site, `Hi ${site.name}, I'd like to book an appointment.`))}" target="_blank" rel="noopener">Send a message</a>`,
      note: 'Send your time and we reply with a confirmation.',
    },
    {
      icon: icon.pin,
      title: 'Come by',
      body: `${esc(site.address.line1)}<br>${esc(site.address.line2)}`,
      note: `<a class="text-link" href="${esc(site.address.mapsUrl)}" target="_blank" rel="noopener">Open in Maps →</a>`,
    },
  ];
  return `
  <div class="contact-grid">
    ${cards
      .map(
        (c) => `<article class="contact-card reveal">
      <span class="contact-icon" aria-hidden="true">${c.icon}</span>
      <h3>${c.title}</h3>
      <p class="contact-body">${c.body}</p>
      <p class="contact-note">${c.note}</p>
    </article>`
      )
      .join('\n    ')}
  </div>`;
}
