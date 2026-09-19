/**
 * Blocks that more than one page needs: the service menu, the hours table, the
 * FAQ, the team, packages and reviews. Each one is built from site.config.json,
 * so the shop edits data in one place and every page that shows it follows.
 */

import { esc, pretty, waLink, icon } from './layout.mjs';

export const sectionHead = (eyebrow, heading, sub = '') => `
  <div class="section-head reveal">
    <p class="eyebrow center">${esc(eyebrow)}</p>
    <h2 class="center">${heading}</h2>
    ${sub ? `<p class="section-sub">${sub}</p>` : ''}
  </div>`;

export const divider = '<div class="divider" aria-hidden="true"><span>✦</span></div>';

export function ctaStrip(site, heading, sub) {
  return `
<section class="cta-strip" id="book">
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

export function serviceMenu(site, { filters = true } = {}) {
  const showPrices = hasPrices(site);
  const groups = site.serviceGroups.filter((g) => site.services.some((s) => s.group === g));

  const tabs = filters
    ? `
  <div class="menu-tools reveal">
    <div class="filter-row" role="tablist" aria-label="Filter services">
      <button class="chip is-active" data-filter="all" role="tab" aria-selected="true">All</button>
      ${groups
        .map(
          (g) =>
            `<button class="chip" data-filter="${esc(g)}" role="tab" aria-selected="false">${esc(g)}</button>`
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

  const rows = site.services
    .map((s, i) => {
      const n = String(i + 1).padStart(2, '0');
      return `    <article class="menu-row reveal" data-group="${esc(s.group)}" data-name="${esc(`${s.name} ${s.ar ?? ''}`)}">
      <span class="menu-num">${n}</span>
      <div class="menu-body">
        <h3>${esc(s.name)}${s.ar ? ` <span class="menu-ar" lang="ar" dir="rtl">${esc(s.ar)}</span>` : ''}</h3>
        <p>${esc(s.blurb ?? '')}</p>
      </div>
      <div class="menu-meta">
        <span class="menu-time">${s.minutes} min</span>
        ${showPrices ? `<span class="menu-price">${s.price == null ? 'On request' : esc(money(site, s.price))}</span>` : ''}
      </div>
      <a class="menu-book" href="book.html?service=${encodeURIComponent(s.name)}" aria-label="Book ${esc(s.name)}">Book →</a>
    </article>`;
    })
    .join('\n');

  return `${tabs}
  <div class="menu-list" id="menuList">
${rows}
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

export function teamGrid(site) {
  return `
  <div class="team-grid">
    ${site.team
      .map(
        (m) => `<article class="team-card reveal">
      <div class="team-photo">
        ${
          m.photo
            ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy">`
            : `<span class="team-initial" aria-hidden="true">${esc(m.name.slice(0, 1))}</span>`
        }
      </div>
      <h3>${esc(m.name)}</h3>
      <p class="team-role">${esc(m.role)}</p>
      <p class="team-specialty">${esc(m.specialty)}</p>
      <a class="text-link" href="book.html?barber=${encodeURIComponent(m.name)}">Book with ${esc(m.name)} →</a>
    </article>`
      )
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

export const GALLERY = [
  { file: 'storefront.jpg', alt: 'Escape Barbershop storefront at night', group: 'The Shop' },
  { file: 'entrance-lights.jpg', alt: 'Entrance with pendant lighting', group: 'The Shop' },
  { file: 'barber-chairs.jpg', alt: 'Barber chairs lined up along the mirrors', group: 'The Chairs' },
  { file: 'pedicure-area.jpg', alt: 'Pedicure area with dark leather chairs', group: 'The Chairs' },
  { file: 'wash-station.jpg', alt: 'Wash basin station', group: 'Stations' },
];

export function galleryGrid({ filters = true, items = GALLERY } = {}) {
  const groups = [...new Set(items.map((i) => i.group))];
  const tabs = filters
    ? `
  <div class="filter-row center reveal" role="tablist" aria-label="Filter photos">
    <button class="chip is-active" data-gallery-filter="all" role="tab" aria-selected="true">Everything</button>
    ${groups
      .map(
        (g) =>
          `<button class="chip" data-gallery-filter="${esc(g)}" role="tab" aria-selected="false">${esc(g)}</button>`
      )
      .join('\n    ')}
  </div>`
    : '';
  const tiles = items
    .map(
      (img, i) => `    <button class="gallery-item reveal${img.span ? ` is-${img.span}` : ''}" data-group="${esc(img.group)}" data-index="${i}" aria-label="Open photo: ${esc(img.alt)}">
      <img src="images/${img.file}" alt="${esc(img.alt)}" loading="lazy" width="800" height="600">
      <span class="gallery-caption">${esc(img.group)}</span>
    </button>`
    )
    .join('\n');
  return `${tabs}
  <div class="gallery-grid" id="galleryGrid">
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
