/**
 * Everything interactive on the site. Compiled to js/script.js by `npm run build`.
 *
 * Each block below guards on the elements it needs, so one script can serve
 * every page: the booking form code simply does nothing on the gallery page.
 */

type DayHours = { day: string; open: string | null; close: string | null };
type SiteData = {
  hours: DayHours[];
  name: string;
  whatsapp: string;
  phone: string;
  address: string;
};

const SITE: SiteData = (() => {
  const el = document.getElementById('site-data');
  const fallback: SiteData = {
    hours: [],
    name: 'Escape Barbershop',
    whatsapp: '',
    phone: '',
    address: '',
  };
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

/* ---------------------------------------------------------------- theme toggle */

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const apply = (theme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  };
  apply(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private browsing or blocked storage: theme just won't persist */
    }
  });
  /* No explicit choice saved yet: keep following the device's setting live,
     so a tab left open through sunset (or a manual OS toggle) still follows
     along, right up until the visitor picks one for themselves. */
  let hasSavedChoice = true;
  try {
    hasSavedChoice = localStorage.getItem('theme') === 'light' || localStorage.getItem('theme') === 'dark';
  } catch {
    /* private browsing or blocked storage: treat as no saved choice */
    hasSavedChoice = false;
  }
  if (!hasSavedChoice) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      apply(e.matches ? 'dark' : 'light');
    });
  }
}

/* ---------------------------------------------------------------- footer year */

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* --------------------------------------------------------------------- nav */

const navToggle = $<HTMLButtonElement>('#navToggle');
const navLinks = $<HTMLUListElement>('#navLinks');
let navScrollY = 0;

/* Locking scroll on both html and body (rather than moving body with
   position: fixed) stops the background from scrolling on mobile without
   fighting the menu panel's own independent scrolling. Plain
   `overflow: hidden` drops the scroll position while it's applied, so it's
   saved here and restored on the next frame once the lock is lifted (doing
   it in the same tick as removing the class is unreliable).

   The CSS lock alone has proven inconsistent on real iOS Safari (touch
   scrolling inside the menu panel sometimes still doesn't register), so a
   touchmove guard backs it up: block any touch drag that starts outside the
   menu panel, and do nothing at all for one that starts inside it, letting
   the panel's own native scrolling handle it untouched. */
function blockBackgroundTouch(e: TouchEvent): void {
  if (navLinks && !navLinks.contains(e.target as Node)) e.preventDefault();
}
function lockScroll(): void {
  navScrollY = window.scrollY;
  document.body.classList.add('nav-open');
  document.documentElement.classList.add('nav-open');
  document.addEventListener('touchmove', blockBackgroundTouch, { passive: false });
}
function unlockScroll(): void {
  document.body.classList.remove('nav-open');
  document.documentElement.classList.remove('nav-open');
  document.removeEventListener('touchmove', blockBackgroundTouch);
  requestAnimationFrame(() => window.scrollTo(0, navScrollY));
}

function closeNav(): void {
  if (!navLinks || !navToggle) return;
  navLinks.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
  unlockScroll();
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    if (isOpen) lockScroll();
    else unlockScroll();
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

/* Native "#top" anchor jumps don't work reliably since the header is
   position: fixed and isn't part of normal document flow. */
$$<HTMLAnchorElement>('a[href="#top"]').forEach((link) =>
  link.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  })
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
  $$<HTMLElement>('.status-pill').forEach((pill) => {
    pill.classList.toggle('is-open', status.open);
    pill.classList.toggle('is-closed', !status.open);
    const text = pill.querySelector<HTMLElement>('.status-text');
    if (text) text.textContent = status.short;
  });
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

/* ------------------------------------------------------------- the film strip */

/* Clips only load and play while they're on screen — the page stays light and
   quiet for anyone who never scrolls that far. */
const reels = $$<HTMLVideoElement>('video[data-autoplay]');
if (reels.length) {
  const reelObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting && !reduceMotion) {
          if (video.preload === 'none') video.preload = 'auto';
          void video.play().catch(() => {
            /* a browser that refuses autoplay just shows the poster */
          });
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.35 }
  );
  reels.forEach((video) => reelObserver.observe(video));
}

/* ------------------------------------------------------- hero parallax drift */

const heroMedia = $<HTMLElement>('.hero-video');
if (heroMedia && !reduceMotion) {
  window.addEventListener(
    'scroll',
    () => {
      const y = Math.min(window.scrollY, window.innerHeight);
      heroMedia.style.transform = `scale(${1 + y * 0.00022}) translateY(${y * 0.12}px)`;
    },
    { passive: true }
  );
}

/* ------------------------------------------------------------- section rail */

/* A quiet marker down the left edge: which part of the page you're in, and how
   far through it. Desktop only — CSS hides it on touch. */
const railSections = $$<HTMLElement>('[data-rail]');
if (railSections.length) {
  const rail = document.createElement('div');
  rail.className = 'rail';
  rail.setAttribute('aria-hidden', 'true');
  rail.innerHTML = '<span class="rail-line"></span><span class="rail-label"></span>';
  document.body.appendChild(rail);
  const label = rail.querySelector<HTMLElement>('.rail-label');
  const line = rail.querySelector<HTMLElement>('.rail-line');

  const updateRail = (): void => {
    const middle = window.scrollY + window.innerHeight * 0.4;
    let current: HTMLElement | null = null;
    railSections.forEach((section) => {
      if (section.offsetTop <= middle) current = section;
    });
    if (!current) {
      rail.classList.remove('is-visible');
      return;
    }
    const section: HTMLElement = current;
    rail.classList.add('is-visible');
    const name = section.dataset.rail ?? '';
    if (label && label.textContent !== name) label.textContent = name;
    const through = (middle - section.offsetTop) / Math.max(section.offsetHeight, 1);
    line?.style.setProperty('--rail-progress', `${Math.max(0, Math.min(through, 1)) * 100}%`);
  };
  updateRail();
  window.addEventListener('scroll', updateRail, { passive: true });
  window.addEventListener('resize', updateRail);
}

/* ------------------------------------------------ service menu filter + search */

const menuList = document.getElementById('menuList');
if (menuList) {
  const rows = $$<HTMLElement>('#menuList .menu-row');
  const groupBlocks = $$<HTMLElement>('[data-group-block]');
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
    /* A heading with nothing under it is just noise. */
    groupBlocks.forEach((block) => {
      const visibleRows = block.querySelectorAll<HTMLElement>('.menu-row:not([hidden])').length;
      block.hidden = visibleRows === 0;
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

  /* The pinned preview: hovering or focusing a row changes the picture beside
     the list, instead of a thumbnail chasing the cursor over the words. */
  const previewImg = $<HTMLImageElement>('#menuPreviewImg');
  const previewKicker = document.getElementById('menuPreviewKicker');
  const previewTitle = document.getElementById('menuPreviewTitle');
  const previewMeta = document.getElementById('menuPreviewMeta');
  const previewCard = document.getElementById('menuPreview');

  if (previewImg && previewCard) {
    const showRow = (row: HTMLElement): void => {
      const src = row.dataset.preview;
      if (src && previewImg.getAttribute('src') !== src) {
        previewCard.classList.add('is-swapping');
        previewImg.src = src;
        window.setTimeout(() => previewCard.classList.remove('is-swapping'), 220);
      }
      if (previewKicker) previewKicker.textContent = row.dataset.group ?? '';
      if (previewTitle) previewTitle.textContent = row.dataset.service ?? '';
      if (previewMeta) {
        const minutes = row.dataset.minutes;
        previewMeta.textContent = minutes ? `About ${minutes} minutes in the chair` : '';
      }
    };

    rows.forEach((row) => {
      row.addEventListener('mouseenter', () => showRow(row));
      row.addEventListener('focusin', () => showRow(row));
    });
  }
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
  const rail = document.getElementById('lightboxRail');
  let index = 0;
  let lastFocused: HTMLElement | null = null;

  const visibleTiles = (): HTMLButtonElement[] => tiles.filter((t) => !t.hidden);

  /* A strip of thumbnails along the bottom: where you are in the set, and a way
     to jump straight to a photo instead of arrowing through everything. */
  const buildRail = (list: HTMLButtonElement[]): void => {
    if (!rail) return;
    rail.replaceChildren();
    list.forEach((tile, i) => {
      const source = tile.querySelector('img');
      if (!source) return;
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.setAttribute('aria-label', `Photo ${i + 1}`);
      const image = document.createElement('img');
      image.src = source.src;
      image.alt = '';
      thumb.appendChild(image);
      thumb.addEventListener('click', () => show(i));
      rail.appendChild(thumb);
    });
  };

  const show = (i: number): void => {
    const list = visibleTiles();
    if (!list.length || !lightboxImg) return;
    index = (i + list.length) % list.length;
    const img = list[index].querySelector('img');
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (caption) caption.textContent = `${img.alt} — ${index + 1} of ${list.length}`;
    if (rail) {
      Array.from(rail.children).forEach((thumb, t) => {
        thumb.classList.toggle('is-active', t === index);
      });
      (rail.children[index] as HTMLElement | undefined)?.scrollIntoView({
        block: 'nearest',
        inline: 'center',
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }
  };

  const open = (i: number): void => {
    if (!lightbox) return;
    lastFocused = document.activeElement as HTMLElement;
    lightbox.hidden = false;
    document.body.classList.add('nav-open');
    buildRail(visibleTiles());
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

  /* Live slot picker: half-hour buttons across that day's opening hours,
     greyed out wherever that exact barber is already booked. "No
     preference" isn't tracked — there's no specific chair to check against
     — so those times always show open, same as the plain time field did. */
  const slotGrid = document.getElementById('slotGrid');
  const slotNote = document.getElementById('slotNote');
  let takenSlots = new Set<string>();

  const dayTimes = (dateValue: string): string[] => {
    if (!SITE.hours.length || !dateValue) return [];
    const day = SITE.hours[new Date(`${dateValue}T00:00`).getDay()];
    if (!day || !day.open || !day.close) return [];
    const times: string[] = [];
    for (let m = toMinutes(day.open); m < toMinutes(day.close); m += 30) {
      times.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
    }
    return times;
  };

  const renderSlots = (): void => {
    if (!slotGrid || !dateInput || !timeInput) return;
    const times = dayTimes(dateInput.value);
    if (!times.length) {
      slotGrid.hidden = true;
      timeInput.hidden = false;
      if (slotNote) slotNote.hidden = true;
      return;
    }
    timeInput.hidden = true;
    slotGrid.hidden = false;
    if (slotNote) slotNote.hidden = true;
    slotGrid.innerHTML = times
      .map((t) => {
        const taken = takenSlots.has(t);
        const selected = timeInput.value === t;
        return `<button type="button" class="slot-btn${selected ? ' is-selected' : ''}" data-time="${t}"${taken ? ' disabled' : ''}>${prettyTime(t)}</button>`;
      })
      .join('');
  };

  slotGrid?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.slot-btn');
    if (!btn || btn.disabled || !timeInput) return;
    timeInput.value = btn.dataset.time ?? '';
    /* Setting .value directly doesn't fire input/change, which the live
       summary card beside the form listens for. */
    timeInput.dispatchEvent(new Event('input', { bubbles: true }));
    setError(timeInput, false);
    renderSlots();
  });

  const refreshTaken = async (): Promise<void> => {
    takenSlots = new Set();
    if (dateInput?.value && barberInput?.value) {
      try {
        const res = await fetch(
          `/api/slots?date=${encodeURIComponent(dateInput.value)}&barber=${encodeURIComponent(barberInput.value)}`
        );
        if (res.ok) {
          const data = (await res.json()) as { taken?: string[] };
          takenSlots = new Set(data.taken ?? []);
        }
      } catch {
        /* offline, or the API isn't reachable — just show every hour as open */
      }
    }
    renderSlots();
  };

  dateInput?.addEventListener('change', refreshTaken);
  barberInput?.addEventListener('change', refreshTaken);
  refreshTaken();

  /* Best-effort: reserves the slot in the background once a request is
     actually sent. Never blocks the WhatsApp/SMS/copy action on it — that
     message is what the shop actually confirms, this is just what keeps
     the next visitor from being offered the same exact slot. */
  const reserveSlot = (): void => {
    if (!dateInput?.value || !timeInput?.value) return;
    fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: dateInput.value,
        time: timeInput.value,
        barber: barberInput?.value ?? '',
        name: nameInput?.value.trim() ?? '',
        phone: phoneInput?.value.trim() ?? '',
        service: serviceInput?.value ?? '',
        notes: notesInput?.value.trim() ?? '',
      }),
    })
      .then((res) => {
        if (res.status === 409 && status) {
          status.textContent += ' Heads up — that exact time may have just been taken by someone else; we’ll confirm on WhatsApp either way.';
        }
      })
      .catch(() => {
        /* the reservation is best-effort; the WhatsApp message is what actually gets confirmed */
      });
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
    reserveSlot();
  });

  $<HTMLButtonElement>('#bookSms')?.addEventListener('click', () => {
    if (!validate()) return;
    const message = buildMessage();
    showPreview(message, 'Your messages app is opening. Press send there to finish the request.');
    location.href = `sms:${SITE.phone}?&body=${encodeURIComponent(message)}`;
    reserveSlot();
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
    reserveSlot();
  });

  /* Clear an error as soon as the visitor fixes it. */
  [nameInput, phoneInput, serviceInput, dateInput, timeInput].forEach((field) => {
    field?.addEventListener('input', () => setError(field, false));
  });

  /* A card beside the form that fills in as you do, so the request is readable
     before it is sent. */
  const summary = document.getElementById('bookSummary');
  if (summary) {
    const slot = (key: string): HTMLElement | null =>
      summary.querySelector<HTMLElement>(`[data-summary="${key}"]`);

    const dayNames = SITE.hours.map((d) => d.day);
    const prettyDate = (value: string): string => {
      const date = new Date(`${value}T00:00`);
      if (Number.isNaN(date.getTime())) return '';
      return `${dayNames[date.getDay()] ?? ''} ${date.getDate()} ${date.toLocaleString('en', { month: 'long' })}`;
    };

    const updateSummary = (): void => {
      const service = slot('service');
      if (service) service.textContent = serviceInput?.value || '—';

      const barber = slot('barber');
      if (barber) barber.textContent = barberInput?.value || 'Whoever is free';

      const when = slot('when');
      if (when) {
        const date = dateInput?.value ? prettyDate(dateInput.value) : '';
        const time = timeInput?.value ? prettyTime(timeInput.value) : '';
        when.textContent = date && time ? `${date}, ${time}` : date || time || '—';
      }

      const minutes = slot('minutes');
      if (minutes) {
        const value = serviceInput?.selectedOptions[0]?.dataset.minutes;
        minutes.textContent = value ? `About ${value} minutes` : '—';
      }
    };

    [nameInput, phoneInput, serviceInput, barberInput, dateInput, timeInput].forEach((field) => {
      field?.addEventListener('input', updateSummary);
      field?.addEventListener('change', updateSummary);
    });
    updateSummary();
  }

  /* Returning customers shouldn't retype their own name and number. Stored on
     this device only, and only after they've actually sent a request. */
  const REMEMBER_KEY = 'escape.customer';
  try {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      const { name, phone } = JSON.parse(saved) as { name?: string; phone?: string };
      if (nameInput && name && !nameInput.value) nameInput.value = name;
      if (phoneInput && phone && !phoneInput.value) phoneInput.value = phone;
    }
  } catch {
    /* private browsing, or storage turned off — just show an empty form */
  }

  const remember = (): void => {
    try {
      localStorage.setItem(
        REMEMBER_KEY,
        JSON.stringify({ name: nameInput?.value.trim(), phone: phoneInput?.value.trim() })
      );
    } catch {
      /* nothing to do — remembering is a convenience, not a requirement */
    }
  };
  bookingForm.addEventListener('submit', remember);
  $<HTMLButtonElement>('#bookSms')?.addEventListener('click', remember);

  /* An .ics the visitor can drop into their own calendar. It's marked
     tentative, because the shop hasn't confirmed anything yet. */
  const pad = (n: number): string => String(n).padStart(2, '0');
  const stamp = (d: Date): string =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  $<HTMLButtonElement>('#bookCalendar')?.addEventListener('click', () => {
    if (!dateInput?.value || !timeInput?.value || !serviceInput?.value) return;
    const start = new Date(`${dateInput.value}T${timeInput.value}`);
    const minutes = Number(
      serviceInput.selectedOptions[0]?.dataset.minutes ?? '30'
    );
    const end = new Date(start.getTime() + minutes * 60000);
    const barber = barberInput?.value ? ` with ${barberInput.value}` : '';
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Escape Barbershop//Website//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@escape-barbershop`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${serviceInput.value}${barber} — ${SITE.name}`,
      `LOCATION:${SITE.address}`,
      'STATUS:TENTATIVE',
      'DESCRIPTION:Requested through the website. Not confirmed until the shop replies.',
      'END:VEVENT',
      'END:VCALENDAR',
    ];
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'escape-barbershop.ics';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  /* If they land here after hours, say so rather than let them wonder. */
  const bookingStatus = shopStatus();
  const aside = document.getElementById('bookNote');
  if (aside && bookingStatus && !bookingStatus.open) {
    aside.textContent = `${bookingStatus.long} Send the request anyway — we'll reply when we open.`;
    aside.hidden = false;
  }
}

/* ------------------------------------------------------------ print the menu */

$<HTMLButtonElement>('#printMenu')?.addEventListener('click', () => window.print());
