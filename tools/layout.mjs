/**
 * The shell every page is poured into: <head>, header, footer, and the bits
 * that sit on top of everything (skip link, progress bar, mobile action bar).
 *
 * Page files under src/pages/ only describe their own content — anything that
 * repeats across the site is written once, here.
 */

export const NAV = [
  { href: 'services.html', label: 'Services' },
  { href: 'offers.html', label: 'Offers' },
  { href: 'behind-the-chair.html', label: 'The Barbers' },
  { href: 'gallery.html', label: 'Gallery' },
  { href: 'about.html', label: 'About' },
  { href: 'visit.html', label: 'Visit' },
];

/** Shown in the mobile menu and the footer, where there's room for everything. */
export const NAV_SECONDARY = [
  { href: 'reviews.html', label: 'Reviews' },
  { href: 'faq.html', label: 'FAQ' },
  { href: 'contact.html', label: 'Contact' },
];

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** "21:00" -> "9 PM", "10:30" -> "10:30 AM" */
export function pretty(time) {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, '0')} ${suffix}` : `${hour} ${suffix}`;
}

export const waLink = (site, text) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

const icon = {
  instagram:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="0.6"/></svg>',
  tiktok:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 3v10.8a3.2 3.2 0 1 1-2.6-3.15"/><path d="M13.5 3c.3 2.4 2.1 4.3 4.5 4.6"/></svg>',
  facebook:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 8.5h-2A1.5 1.5 0 0 0 11 10v2H9v3h2v6h3v-6h2l.4-3H14v-1.5c0-.6.4-1 1-1h1.5V6H15a3.5 3.5 0 0 0-3.5 3.5V10"/></svg>',
  whatsapp:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.7a8 8 0 0 1-11.9 7L4 20l1.4-4a8 8 0 1 1 14.6-4.3z"/><path d="M9.2 9c.3 1.6 1.4 3.4 3.1 4.4l1.2-1.1 2 1c.1 1.3-1.2 2-2.3 1.7-2.4-.6-4.6-3-5.1-5.4C7.8 8.5 8.4 7.8 9.2 9z"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h3l1.5 4.5L8.6 9a12 12 0 0 0 6.4 6.4l1.5-1.9L21 15v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.2 2 2 0 0 1 6 3z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  calendar:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
};

export function socialLinks(site, className = 'social-icons') {
  const entries = Object.entries(site.social).filter(([, url]) => url);
  if (!entries.length) return '';
  const links = entries
    .map(
      ([network, url]) =>
        `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${network[0].toUpperCase()}${network.slice(1)}">${icon[network] ?? ''}</a>`
    )
    .join('\n      ');
  return `<div class="${className}">\n      ${links}\n    </div>`;
}

function head(page, site) {
  const title = page.title ?? site.name;
  const description = page.description ?? site.description;
  const canonical = `${site.url}/${page.file === 'index.html' ? '' : page.file.replace(/\.html$/, '')}`;
  const ogImage = `${site.url}/images/storefront.jpg`;
  return `<meta charset="UTF-8">
<script>(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="theme-color" content="#0a0a0a">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css?v=${site.assetVersion.css}">
<link rel="icon" href="images/favicon.png?v=2" type="image/png">
<link rel="apple-touch-icon" href="images/apple-touch-icon.png?v=2">
<link rel="manifest" href="site.webmanifest">`;
}

/** Structured data, so Google can show hours, location and the FAQ. */
function jsonLd(page, site) {
  const business = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: site.name,
    description: site.description,
    url: site.url,
    image: `${site.url}/images/storefront.jpg`,
    telephone: site.phoneHref,
    email: site.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.line1,
      addressLocality: site.address.line2,
      addressCountry: site.address.country,
    },
    hasMap: site.address.mapsUrl,
    sameAs: Object.values(site.social).filter(Boolean),
    openingHoursSpecification: site.hours
      .filter((d) => d.open)
      .map((d) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${d.day}`,
        opens: d.open,
        closes: d.close,
      })),
  };
  const blocks = [business];
  if (page.file === 'faq.html') {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: site.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
  }
  return blocks
    .map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`)
    .join('\n');
}

function header(page, site) {
  const links = NAV.map(
    (item) =>
      `<li><a href="${item.href}" data-page="${item.href}"${page.file === item.href ? ' aria-current="page"' : ''}>${item.label}</a></li>`
  ).join('\n        ');
  const extra = NAV_SECONDARY.map(
    (item) =>
      `<li class="nav-extra"><a href="${item.href}" data-page="${item.href}"${page.file === item.href ? ' aria-current="page"' : ''}>${item.label}</a></li>`
  ).join('\n        ');
  return `<header class="site-header" id="top">
  <div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>
  <nav class="nav" aria-label="Main">
    <a class="logo" href="index.html" aria-label="${esc(site.name)} — home">
      <img src="images/logo-dark.png" alt="${esc(site.name)}" class="nav-logo on-light" width="150" height="44">
      <img src="images/logo.png" alt="" aria-hidden="true" class="nav-logo on-dark" width="150" height="44">
    </a>
    <div class="nav-mobile-right">
      <div class="status-pill status-pill-top" id="statusPillTop" title="Today's hours"><span class="status-dot"></span><span class="status-text">Checking hours…</span></div>
      <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks">
        <span></span><span></span><span></span>
      </button>
    </div>
    <ul class="nav-links" id="navLinks">
        ${links}
        ${extra}
      <li class="status-pill status-pill-nav" id="statusPillNav" title="Today's hours"><span class="status-dot"></span><span class="status-text">Checking hours…</span></li>
      <li>
        <button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch to dark mode">
          <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
          <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>
        </button>
      </li>
      <li><a href="book.html" class="nav-cta">Book Now</a></li>
    </ul>
  </nav>
</header>`;
}

function footer(site) {
  const today = site.hours;
  const hoursRows = today
    .map(
      (d, i) =>
        `<li data-weekday="${i}"><span>${d.day.slice(0, 3)}</span><span>${d.open ? `${pretty(d.open)} – ${pretty(d.close)}` : 'Closed'}</span></li>`
    )
    .join('\n        ');
  const explore = [...NAV, ...NAV_SECONDARY]
    .map((item) => `<a href="${item.href}">${item.label}</a>`)
    .join('\n        ');
  return `<footer class="site-footer theme-dark">
  <div class="footer-inner">
    <div class="footer-lead">
      <div>
        <img src="images/logo.png" alt="${esc(site.name)}" class="footer-logo" width="170" height="50" loading="lazy">
        <p class="footer-tagline">${esc(site.tagline)}.</p>
      </div>
      <div class="footer-lead-actions">
        <a class="btn btn-primary" href="book.html">Book a Chair</a>
        <a class="btn btn-ghost" href="tel:${esc(site.phoneHref)}">${esc(site.phoneDisplay)}</a>
        ${socialLinks(site)}
      </div>
    </div>

    <div class="footer-top">
      <div class="footer-col">
        <h4>Explore</h4>
        <div class="footer-links">
          <a href="index.html">Home</a>
          ${explore}
        </div>
      </div>
      <div class="footer-col">
        <h4>Find us</h4>
        <a class="footer-map" href="${esc(site.address.mapsUrl)}" target="_blank" rel="noopener">
          <img src="images/gallery/the-shop/storefront-at-night.jpg" alt="The shop at night, Eterna Mall Gate 2" loading="lazy" width="600" height="400">
          <span>Open in Maps →</span>
        </a>
        <p class="footer-text">${esc(site.address.line1)}<br>${esc(site.address.line2)}</p>
      </div>
      <div class="footer-col">
        <h4>Reach us</h4>
        <p class="footer-text">
          <a href="tel:${esc(site.phoneHref)}">${esc(site.phoneDisplay)}</a><br>
          <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>
        </p>
        <p class="footer-text">Walk-ins welcome.<br>Booking ahead saves the wait.</p>
      </div>
      <div class="footer-col">
        <h4>Hours</h4>
        <ul class="hours-list compact" data-hours-list>
          ${hoursRows}
        </ul>
        <p class="status-inline" id="statusInline">Checking today's hours…</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; <span id="year">2026</span> ${esc(site.name)}. All Rights Reserved.</p>
      <p class="footer-credit"><a href="#top">Back to top ↑</a></p>
    </div>
    <span class="footer-mark" aria-hidden="true">${esc(site.name)}</span>
  </div>
</footer>`;
}

function mobileBar(site) {
  return `<div class="action-bar" aria-label="Quick actions">
  <a href="tel:${esc(site.phoneHref)}" aria-label="Call the shop">${icon.phone}<span>Call</span></a>
  <a href="${esc(waLink(site, `Hi ${site.name}, I'd like to book an appointment.`))}" target="_blank" rel="noopener" aria-label="Message on WhatsApp">${icon.whatsapp}<span>WhatsApp</span></a>
  <a href="book.html" class="action-primary" aria-label="Book an appointment">${icon.calendar}<span>Book</span></a>
</div>`;
}

export function render(page, site) {
  const siteData = JSON.stringify({
    hours: site.hours,
    name: site.name,
    whatsapp: site.whatsapp,
    phone: site.phoneHref,
    address: `${site.address.line1}, ${site.address.line2}, ${site.address.country}`,
  });
  return `<!DOCTYPE html>
<html lang="en">
<head>
${head(page, site)}
${jsonLd(page, site)}
</head>
<body${page.bodyClass ? ` class="${page.bodyClass}"` : ''}>

<a class="skip-link" href="#main">Skip to content</a>
<div class="grain" aria-hidden="true"></div>

${header(page, site)}

<main id="main">
${page.body}
</main>

${footer(site)}
${mobileBar(site)}

<button class="to-top" id="toTop" aria-label="Back to top" hidden>↑</button>

<script id="site-data" type="application/json">${siteData}</script>
<script src="js/script.js?v=${site.assetVersion.js}" defer></script>
</body>
</html>
`;
}

export { icon };
