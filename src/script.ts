/**
 * Everything interactive on the site. Compiled to js/script.js by `npm run build`.
 *
 * Each block below guards on the elements it needs, so one script can serve
 * every page: the booking form code simply does nothing on the gallery page.
 */

type DayHours = { day: string; open: string | null; close: string | null };
type SiteData = { hours: DayHours[]; name: string; whatsapp: string; phone: string };

const SITE: SiteData = (() => {
  const el = document.getElementById('site-data');
  const fallback: SiteData = { hours: [], name: 'Escape Barbershop', whatsapp: '', phone: '' };
  if (!el || !el.textContent) return fallback;
  try {
    return { ...fallback, ...(JSON.parse(el.textContent) as Partial<SiteData>) };
  } catch {
    return fallback;
  }
})();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element>(sel: string): T | null => document.querySelector<T>(sel);
const $$ = <T extends Element>(sel: string): T[] => Array.from(document.querySelectorAll<T>(sel));

/* ---------------------------------------------------------------- footer year */

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* --------------------------------------------------------------------- nav */

const navToggle = $<HTMLButtonElement>('#navToggle');
const navLinks = $<HTMLUListElement>('#navLinks');

function closeNav(): void {
  if (!navLinks || !navToggle) return;
  navLinks.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
  document.body.classList.remove('nav-open');
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', isOpen);
  });
  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeNav();
      navToggle.focus();
    }
  });
}

/* Highlight the nav link for the current page (also set at build time; this
   keeps a trailing-slash URL or a file:// preview honest). */
const currentPage = location.pathname.split('/').pop() || 'index.html';
$$<HTMLAnchorElement>('a[data-page]').forEach((link) => {
  if (link.dataset.page === currentPage) link.classList.add('active');
});

/* ------------------------------------------- header, scroll progress, to top */

const header = $<HTMLElement>('.site-header');
const progress = $<HTMLElement>('#scrollProgress');
const toTop = $<HTMLButtonElement>('#toTop');

function onScroll(): void {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 40);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
  }
  if (toTop) toTop.hidden = y < 600;
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
toTop?.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
);

/* ------------------------------------------------- reveal on scroll + counters */

function animateCount(el: HTMLElement): void {
  const target = parseFloat(el.dataset.count ?? '0');
  const suffix = el.dataset.suffix ?? '';
  if (reduceMotion) {
    el.textContent = target + suffix;
    return;
  }
  const duration = 1200;
  const start = performance.now();
  const tick = (now: number): void => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      el.classList.add('in-view');
      el.querySelectorAll<HTMLElement>('[data-count]').forEach(animateCount);
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
$$('.reveal').forEach((el) => revealObserver.observe(el));

/* ------------------------------------------------------- opening hours status */

const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const prettyTime = (time: string): string => {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, '0')} ${suffix}` : `${hour} ${suffix}`;
};

type Status = { open: boolean; short: string; long: string };

function shopStatus(now = new Date()): Status | null {
  if (!SITE.hours.length) return null;
  const today = SITE.hours[now.getDay()];
  const minutes = now.getHours() * 60 + now.getMinutes();

  if (today && today.open && today.close) {
    const opens = toMinutes(today.open);
    const closes = toMinutes(today.close);
    if (minutes >= opens && minutes < closes) {
      const left = closes - minutes;
      return {
        open: true,
        short: `Open · closes ${prettyTime(today.close)}`,
        long:
          left <= 60
            ? `Open now — last chair in ${left} minutes, closing at ${prettyTime(today.close)}.`
            : `Open now until ${prettyTime(today.close)}.`,
      };
    }
    if (minutes < opens) {
      return {
        open: false,
        short: `Closed · opens ${prettyTime(today.open)}`,
        long: `Closed right now — we open today at ${prettyTime(today.open)}.`,
      };
    }
  }

  /* Shut for the rest of today: find the next day we're in. */
  for (let i = 1; i <= 7; i += 1) {
    const day = SITE.hours[(now.getDay() + i) % 7];
    if (day && day.open) {
      const label = i === 1 ? 'tomorrow' : day.day.slice(0, 3);
      return {
        open: false,
        short: `Closed · opens ${label} ${prettyTime(day.open)}`,
        long: `Closed now — we open again ${i === 1 ? 'tomorrow' : `on ${day.day}`} at ${prettyTime(day.open)}.`,
      };
    }
  }
  return null;
}

function updateStatus(): void {
  const status = shopStatus();
  if (!status) return;
  const pill = document.getElementById('statusPill');
  const text = document.getElementById('statusText');
  if (pill && text) {
    pill.classList.toggle('is-open', status.open);
    pill.classList.toggle('is-closed', !status.open);
    text.textContent = status.short;
  }
  const inline = document.getElementById('statusInline');
  if (inline) {
    inline.textContent = status.long;
    inline.classList.toggle('is-open', status.open);
    inline.classList.toggle('is-closed', !status.open);
  }
  /* Mark today's row in every hours table on the page. */
  const weekday = new Date().getDay();
  $$<HTMLElement>('[data-hours-list] li').forEach((li) => {
    li.classList.toggle('is-today', Number(li.dataset.weekday) === weekday);
  });
}
updateStatus();
window.setInterval(updateStatus, 60000);

/* ----------------------------------------------------------- hero cursor glow */

const hero = $<HTMLElement>('.hero');
const cursorGlow = document.getElementById('cursorGlow');
if (hero && cursorGlow && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = hero.getBoundingClientRect();
    cursorGlow.style.setProperty('--x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    cursorGlow.style.setProperty('--y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  });
}

/* ------------------------------------------------ service menu filter + search */

const menuList = document.getElementById('menuList');
if (menuList) {
  const rows = $$<HTMLElement>('#menuList .menu-row');
  const chips = $$<HTMLButtonElement>('[data-filter]');
  const search = $<HTMLInputElement>('#serviceSearch');
  const empty = document.getElementById('filterEmpty');
  let group = 'all';

  const apply = (): void => {
    const term = (search ? search.value : '').trim().toLowerCase();
    let shown = 0;
    rows.forEach((row) => {
      const matchesGroup = group === 'all' || row.dataset.group === group;
      const matchesTerm = !term || (row.dataset.name ?? '').toLowerCase().includes(term);
      const visible = matchesGroup && matchesTerm;
      row.hidden = !visible;
      if (visible) shown += 1;
    });
    if (empty) empty.hidden = shown > 0;
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      group = chip.dataset.filter ?? 'all';
      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-selected', String(active));
      });
      apply();
    });
  });
  search?.addEventListener('input', apply);
}

/* --------------------------------------------------- gallery filter + lightbox */

const galleryGrid = document.getElementById('galleryGrid');
if (galleryGrid) {
  const tiles = $$<HTMLButtonElement>('#galleryGrid .gallery-item');
  const filterChips = $$<HTMLButtonElement>('[data-gallery-filter]');
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.galleryFilter ?? 'all';
      filterChips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-selected', String(active));
      });
      tiles.forEach((tile) => {
        tile.hidden = filter !== 'all' && tile.dataset.group !== filter;
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = $<HTMLImageElement>('#lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  let index = 0;
  let lastFocused: HTMLElement | null = null;

  const visibleTiles = (): HTMLButtonElement[] => tiles.filter((t) => !t.hidden);

  const show = (i: number): void => {
    const list = visibleTiles();
    if (!list.length || !lightboxImg) return;
    index = (i + list.length) % list.length;
    const img = list[index].querySelector('img');
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (caption) caption.textContent = `${img.alt} — ${index + 1} of ${list.length}`;
  };

  const open = (i: number): void => {
    if (!lightbox) return;
    lastFocused = document.activeElement as HTMLElement;
    lightbox.hidden = false;
    document.body.classList.add('nav-open');
    show(i);
    $<HTMLButtonElement>('#lightboxClose')?.focus();
  };

  const close = (): void => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove('nav-open');
    lastFocused?.focus();
  };

  tiles.forEach((tile) => {
    tile.addEventListener('click', () => open(visibleTiles().indexOf(tile)));
  });
  $<HTMLButtonElement>('#lightboxClose')?.addEventListener('click', close);
  $<HTMLButtonElement>('#lightboxPrev')?.addEventListener('click', () => show(index - 1));
  $<HTMLButtonElement>('#lightboxNext')?.addEventListener('click', () => show(index + 1));
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });

  /* Swipe on touch screens. */
  let touchX = 0;
  lightbox?.addEventListener(
    'touchstart',
    (e: TouchEvent) => {
      touchX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  lightbox?.addEventListener(
    'touchend',
    (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
    },
    { passive: true }
  );
}

/* ------------------------------------------------------------- FAQ accordion */

$$<HTMLButtonElement>('.faq-q').forEach((button) => {
  const panel = document.getElementById(button.getAttribute('aria-controls') ?? '');
  if (!panel) return;
  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    panel.hidden = isOpen;
    button.closest('.faq-item')?.classList.toggle('is-open', !isOpen);
  });
});

/* Landing on #faq-3 should open that answer. */
if (location.hash.indexOf('#faq-') === 0) {
  const item = document.querySelector<HTMLElement>(location.hash);
  item?.querySelector<HTMLButtonElement>('.faq-q')?.click();
}

/* --------------------------------------------------------------- review slider */

const reviewTrack = document.getElementById('reviewTrack');
const reviewDots = document.getElementById('reviewDots');
if (reviewTrack && reviewDots) {
  const cards = Array.from(reviewTrack.children) as HTMLElement[];
  let current = 0;
  let timer = 0;

  const go = (i: number): void => {
    current = (i + cards.length) % cards.length;
    reviewTrack.style.transform = `translateX(-${current * 100}%)`;
    Array.from(reviewDots.children).forEach((dot, d) => {
      dot.classList.toggle('is-active', d === current);
      dot.setAttribute('aria-selected', String(d === current));
    });
  };

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'review-dot';
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Review ${i + 1}`);
    dot.addEventListener('click', () => go(i));
    reviewDots.appendChild(dot);
  });

  const start = (): void => {
    if (reduceMotion || cards.length < 2) return;
    timer = window.setInterval(() => go(current + 1), 6000);
  };
  const stop = (): void => window.clearInterval(timer);

  reviewTrack.addEventListener('mouseenter', stop);
  reviewTrack.addEventListener('mouseleave', start);
  go(0);
  start();
}

/* ------------------------------------------------------------- booking form */

const bookingForm = $<HTMLFormElement>('#bookingForm');
if (bookingForm) {
  const nameInput = $<HTMLInputElement>('#bookName');
  const phoneInput = $<HTMLInputElement>('#bookPhone');
  const serviceInput = $<HTMLSelectElement>('#bookService');
  const barberInput = $<HTMLSelectElement>('#bookBarber');
  const dateInput = $<HTMLInputElement>('#bookDate');
  const timeInput = $<HTMLInputElement>('#bookTime');
  const notesInput = $<HTMLTextAreaElement>('#bookNotes');
  const status = document.getElementById('bookStatus');
  const preview = document.getElementById('bookPreview');
  const previewText = document.getElementById('bookPreviewText');

  const iso = (d: Date): string =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const todayIso = iso(new Date());

  if (dateInput) {
    dateInput.min = todayIso;
    const horizon = new Date();
    horizon.setMonth(horizon.getMonth() + 3);
    dateInput.max = iso(horizon);
  }

  /* Deep links from the menu and the team page: book.html?service=…&barber=… */
  const params = new URLSearchParams(location.search);
  const preselect = (select: HTMLSelectElement | null, value: string | null): void => {
    if (!select || !value) return;
    const match = Array.from(select.options).find(
      (o) => o.value.toLowerCase() === value.toLowerCase()
    );
    if (match) select.value = match.value;
  };
  preselect(serviceInput, params.get('service'));
  preselect(barberInput, params.get('barber'));

  const setError = (field: HTMLElement | null, show: boolean): void => {
    if (!field) return;
    const message = document.querySelector<HTMLElement>(`[data-error-for="${field.id}"]`);
    if (message) message.hidden = !show;
    field.classList.toggle('has-error', show);
    field.setAttribute('aria-invalid', String(show));
  };

  /** A chosen slot has to fall inside that day's opening hours. */
  const slotIsOpen = (dateValue: string, timeValue: string): boolean => {
    if (!SITE.hours.length) return true;
    const day = SITE.hours[new Date(`${dateValue}T00:00`).getDay()];
    if (!day || !day.open || !day.close) return false;
    const minutes = toMinutes(timeValue);
    return minutes >= toMinutes(day.open) && minutes < toMinutes(day.close);
  };

  const buildMessage = (): string => {
    const lines = [
      `New booking request — ${SITE.name}`,
      '',
      `Name: ${nameInput ? nameInput.value.trim() : ''}`,
      `Phone: ${phoneInput ? phoneInput.value.trim() : ''}`,
      `Service: ${serviceInput ? serviceInput.value : ''}`,
    ];
    if (barberInput && barberInput.value) lines.push(`Barber: ${barberInput.value}`);
    lines.push(`When: ${dateInput ? dateInput.value : ''} at ${timeInput ? timeInput.value : ''}`);
    if (notesInput && notesInput.value.trim()) lines.push(`Notes: ${notesInput.value.trim()}`);
    lines.push('', 'Sent from the website.');
    return lines.join('\n');
  };

  const validate = (): boolean => {
    const nameOk = (nameInput?.value.trim().length ?? 0) > 1;
    const phoneOk = (phoneInput?.value.replace(/\D/g, '').length ?? 0) >= 8;
    const serviceOk = Boolean(serviceInput && serviceInput.value);
    const dateOk = Boolean(dateInput && dateInput.value && dateInput.value >= todayIso);
    const timeOk =
      Boolean(timeInput && timeInput.value) &&
      dateOk &&
      slotIsOpen(dateInput!.value, timeInput!.value);

    setError(nameInput, !nameOk);
    setError(phoneInput, !phoneOk);
    setError(serviceInput, !serviceOk);
    setError(dateInput, !dateOk);
    setError(timeInput, !timeOk);

    const checks: Array<[boolean, HTMLElement | null]> = [
      [nameOk, nameInput],
      [phoneOk, phoneInput],
      [serviceOk, serviceInput],
      [dateOk, dateInput],
      [timeOk, timeInput],
    ];
    const firstBad = checks.find(([ok]) => !ok);
    if (firstBad && firstBad[1]) firstBad[1].focus();

    return nameOk && phoneOk && serviceOk && dateOk && timeOk;
  };

  const showPreview = (message: string, note: string): void => {
    if (previewText) previewText.textContent = message;
    if (preview) preview.hidden = false;
    if (status) {
      status.textContent = note;
      status.classList.add('is-visible');
    }
  };

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      if (status) {
        status.textContent = 'Almost — check the highlighted fields above.';
        status.classList.add('is-visible');
      }
      return;
    }
    const message = buildMessage();
    showPreview(
      message,
      'WhatsApp is opening with your request. Press send there — it is not booked until you do, and we reply to confirm.'
    );
    window.open(
      `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener'
    );
  });

  $<HTMLButtonElement>('#bookSms')?.addEventListener('click', () => {
    if (!validate()) return;
    const message = buildMessage();
    showPreview(message, 'Your messages app is opening. Press send there to finish the request.');
    location.href = `sms:${SITE.phone}?&body=${encodeURIComponent(message)}`;
  });

  $<HTMLButtonElement>('#bookCopy')?.addEventListener('click', () => {
    if (!validate()) return;
    const message = buildMessage();
    navigator.clipboard
      .writeText(message)
      .then(() =>
        showPreview(message, 'Copied. Paste it into WhatsApp, a message, or an email to the shop.')
      )
      .catch(() =>
        showPreview(message, 'Copy the text below and send it to the shop however suits you.')
      );
  });

  /* Clear an error as soon as the visitor fixes it. */
  [nameInput, phoneInput, serviceInput, dateInput, timeInput].forEach((field) => {
    field?.addEventListener('input', () => setError(field, false));
  });
}
