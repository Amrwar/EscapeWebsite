/**
 * End-to-end smoke test: drives a headless Chrome over the DevTools protocol and
 * checks the interactive pieces really work — menu filter and search, the
 * gallery lightbox, the FAQ accordion, and the booking form's validation and
 * the message it hands to WhatsApp.
 *
 *   node tools/smoke.mjs            (expects `npm run serve` on :8000 and
 *                                    chrome --headless --remote-debugging-port=9222)
 */

const BASE = process.env.BASE ?? 'http://localhost:8000';
const CDP = process.env.CDP ?? 'http://localhost:9222';

const targets = await (await fetch(`${CDP}/json`)).json();
const page = targets.find((t) => t.type === 'page');
if (!page) throw new Error('No page target — is Chrome running with --remote-debugging-port?');

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve) => ws.addEventListener('open', resolve));

let id = 0;
const pending = new Map();
ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const msgId = ++id;
    pending.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

const evaluate = async (expression) => {
  const res = await send('Runtime.evaluate', {
    /* Wrapped in a block so each snippet gets its own scope (the page context is
       reused between calls) while still yielding its last expression. */
    expression: `{\n${expression}\n}`,
    returnByValue: true,
    awaitPromise: true,
  });
  if (res.result?.exceptionDetails) {
    throw new Error(res.result.exceptionDetails.exception?.description ?? 'page threw');
  }
  return res.result?.result?.value;
};

const goto = async (path) => {
  await send('Page.navigate', { url: `${BASE}/${path}` });
  await new Promise((r) => setTimeout(r, 900));
};

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

await send('Page.enable');
await send('Runtime.enable');

/* ---- services: filter + search ---- */
await goto('services.html');
const total = await evaluate(`document.querySelectorAll('#menuList .menu-row').length`);
check('menu renders every service', total === 26, `${total} rows`);

const beard = await evaluate(`
  document.querySelector('[data-filter="Beard"]').click();
  [...document.querySelectorAll('#menuList .menu-row')].filter(r => !r.hidden).length
`);
check('filter narrows to one group', beard === 6, `${beard} beard rows`);

const searched = await evaluate(`
  document.querySelector('[data-filter="all"]').click();
  const input = document.querySelector('#serviceSearch');
  input.value = 'henna';
  input.dispatchEvent(new Event('input'));
  [...document.querySelectorAll('#menuList .menu-row')].filter(r => !r.hidden).length
`);
check('search matches by name', searched === 2, `${searched} matches for "henna"`);

const arabicHit = await evaluate(`
  const input = document.querySelector('#serviceSearch');
  input.value = 'قص شعر';
  input.dispatchEvent(new Event('input'));
  [...document.querySelectorAll('#menuList .menu-row')].filter(r => !r.hidden).length
`);
check('search works in Arabic', arabicHit >= 1, `${arabicHit} matches`);

const emptyState = await evaluate(`
  const input = document.querySelector('#serviceSearch');
  input.value = 'zzzz';
  input.dispatchEvent(new Event('input'));
  !document.querySelector('#filterEmpty').hidden
`);
check('empty state appears when nothing matches', emptyState === true);

/* ---- gallery lightbox ---- */
await goto('gallery.html');
const opened = await evaluate(`
  document.querySelector('#galleryGrid .gallery-item').click();
  !document.querySelector('#lightbox').hidden && document.querySelector('#lightboxImg').src.length > 0
`);
check('lightbox opens with an image', opened === true);

const advanced = await evaluate(`
  const before = document.querySelector('#lightboxImg').src;
  document.querySelector('#lightboxNext').click();
  before !== document.querySelector('#lightboxImg').src
`);
check('lightbox next changes photo', advanced === true);

const closed = await evaluate(`
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  document.querySelector('#lightbox').hidden
`);
check('Escape closes the lightbox', closed === true);

const filtered = await evaluate(`
  document.querySelector('[data-gallery-filter="The Chairs"]').click();
  [...document.querySelectorAll('#galleryGrid .gallery-item')].filter(t => !t.hidden).length
`);
check('gallery filter works', filtered === 2, `${filtered} tiles`);

/* ---- FAQ ---- */
await goto('faq.html');
const faqOpen = await evaluate(`
  const btn = document.querySelector('.faq-q');
  btn.click();
  btn.getAttribute('aria-expanded') === 'true' && !document.getElementById(btn.getAttribute('aria-controls')).hidden
`);
check('FAQ answer opens', faqOpen === true);

const faqClose = await evaluate(`
  const btn = document.querySelector('.faq-q');
  btn.click();
  btn.getAttribute('aria-expanded') === 'false' && document.getElementById(btn.getAttribute('aria-controls')).hidden
`);
check('FAQ answer closes again', faqClose === true);

/* ---- booking form ---- */
await goto('book.html?service=Beard%20Cut&barber=Khaled');
const preselected = await evaluate(
  `document.querySelector('#bookService').value + ' / ' + document.querySelector('#bookBarber').value`
);
check('deep link preselects service and barber', preselected === 'Beard Cut / Khaled', preselected);

const blocksEmpty = await evaluate(`
  document.querySelector('#bookName').value = '';
  document.querySelector('#bookingForm').dispatchEvent(new Event('submit', { cancelable: true }));
  !document.querySelector('[data-error-for="bookName"]').hidden
`);
check('empty name is rejected', blocksEmpty === true);

const closedDay = await evaluate(`
  // Sunday 8am — the shop opens at 11 on Sundays.
  const d = new Date(); d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
  const iso = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  document.querySelector('#bookName').value = 'Test Customer';
  document.querySelector('#bookPhone').value = '01001234567';
  document.querySelector('#bookDate').value = iso;
  document.querySelector('#bookTime').value = '08:00';
  document.querySelector('#bookingForm').dispatchEvent(new Event('submit', { cancelable: true }));
  !document.querySelector('[data-error-for="bookTime"]').hidden
`);
check('a time outside opening hours is rejected', closedDay === true);

const message = await evaluate(`
  const d = new Date(); d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
  const iso = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  document.querySelector('#bookTime').value = '12:00';
  document.querySelector('#bookNotes').value = 'First visit';
  window.open = () => null;              // don't actually launch WhatsApp
  document.querySelector('#bookingForm').dispatchEvent(new Event('submit', { cancelable: true }));
  document.querySelector('#bookPreviewText').textContent
`);
const ok =
  message.includes('Test Customer') &&
  message.includes('Beard Cut') &&
  message.includes('Khaled') &&
  message.includes('First visit') &&
  message.includes('12:00');
check('valid request builds the full message', ok, message.replace(/\n/g, ' | '));

const remembered = await evaluate(`
  JSON.parse(localStorage.getItem('escape.customer') || '{}').name
`);
check('the form remembers who you are for next time', remembered === 'Test Customer', remembered);

const ics = await evaluate(`
  let captured = '';
  const realCreate = URL.createObjectURL;
  URL.createObjectURL = (blob) => { captured = blob; return 'blob:stub'; };
  const realClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {};
  document.querySelector('#bookCalendar').click();
  URL.createObjectURL = realCreate;
  HTMLAnchorElement.prototype.click = realClick;
  captured ? captured.text() : '';
`);
const icsOk =
  typeof ics === 'string' &&
  ics.includes('BEGIN:VEVENT') &&
  ics.includes('SUMMARY:Beard Cut with Khaled') &&
  ics.includes('STATUS:TENTATIVE') &&
  /DTSTART:\d{8}T120000/.test(ics) &&
  /DTEND:\d{8}T122000/.test(ics); // a beard cut is 20 minutes
check('calendar file covers the right slot', icsOk, ics.split('\r\n').slice(3, 9).join(' | '));

/* ---- the team page ---- */
await goto('behind-the-chair.html');
const cards = await evaluate(`document.querySelectorAll('.team-card').length`);
check('every barber has a card', cards === 4, `${cards} cards`);

const fallbacks = await evaluate(`
  document.querySelectorAll('.team-photo .team-initial').length
    + ':' + document.querySelectorAll('.team-photo img').length
`);
check('portraits fall back to a monogram until photos land', fallbacks === '4:0', fallbacks);

const picks = await evaluate(`
  [...document.querySelectorAll('.pick-card')].every(a => a.href.includes('barber='))
`);
check('each pick tile books that barber', picks === true);

/* ---- no page threw ---- */
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
ws.close();
process.exit(failed.length ? 1 : 0);
