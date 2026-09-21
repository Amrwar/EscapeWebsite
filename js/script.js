"use strict";
/**
 * Everything interactive on the site. Compiled to js/script.js by `npm run build`.
 *
 * Each block below guards on the elements it needs, so one script can serve
 * every page: the booking form code simply does nothing on the gallery page.
 */
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
const SITE = (() => {
    const el = document.getElementById('site-data');
    const fallback = {
        hours: [],
        name: 'Escape Barbershop',
        whatsapp: '',
        phone: '',
        address: '',
    };
    if (!el || !el.textContent)
        return fallback;
    try {
        return { ...fallback, ...JSON.parse(el.textContent) };
    }
    catch {
        return fallback;
    }
})();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
/* ---------------------------------------------------------------- theme toggle */
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    const apply = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    };
    apply(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    themeToggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        apply(next);
        try {
            localStorage.setItem('theme', next);
        }
        catch {
            /* private browsing or blocked storage: theme just won't persist */
        }
    });
    /* No explicit choice saved yet: keep following the device's setting live,
       so a tab left open through sunset (or a manual OS toggle) still follows
       along, right up until the visitor picks one for themselves. */
    let hasSavedChoice = true;
    try {
        hasSavedChoice = localStorage.getItem('theme') === 'light' || localStorage.getItem('theme') === 'dark';
    }
    catch {
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
if (yearEl)
    yearEl.textContent = String(new Date().getFullYear());
/* --------------------------------------------------------------------- nav */
const navToggle = $('#navToggle');
const navLinks = $('#navLinks');
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
function blockBackgroundTouch(e) {
    if (navLinks && !navLinks.contains(e.target))
        e.preventDefault();
}
function lockScroll() {
    navScrollY = window.scrollY;
    document.body.classList.add('nav-open');
    document.documentElement.classList.add('nav-open');
    document.addEventListener('touchmove', blockBackgroundTouch, { passive: false });
}
function unlockScroll() {
    document.body.classList.remove('nav-open');
    document.documentElement.classList.remove('nav-open');
    document.removeEventListener('touchmove', blockBackgroundTouch);
    requestAnimationFrame(() => window.scrollTo(0, navScrollY));
}
function closeNav() {
    if (!navLinks || !navToggle)
        return;
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
        if (isOpen)
            lockScroll();
        else
            unlockScroll();
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
$$('a[data-page]').forEach((link) => {
    if (link.dataset.page === currentPage)
        link.classList.add('active');
});
/* ------------------------------------------- header, scroll progress, to top */
const header = $('.site-header');
const progress = $('#scrollProgress');
const toTop = $('#toTop');
function onScroll() {
    const y = window.scrollY;
    header === null || header === void 0 ? void 0 : header.classList.toggle('scrolled', y > 40);
    if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    }
    if (toTop)
        toTop.hidden = y < 600;
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
toTop === null || toTop === void 0 ? void 0 : toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
/* Native "#top" anchor jumps don't work reliably since the header is
   position: fixed and isn't part of normal document flow. */
$$('a[href="#top"]').forEach((link) => link.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}));
/* ------------------------------------------------- reveal on scroll + counters */
function animateCount(el) {
    var _a, _b;
    const target = parseFloat((_a = el.dataset.count) !== null && _a !== void 0 ? _a : '0');
    const suffix = (_b = el.dataset.suffix) !== null && _b !== void 0 ? _b : '';
    if (reduceMotion) {
        el.textContent = target + suffix;
        return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1)
            requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting)
            return;
        const el = entry.target;
        el.classList.add('in-view');
        el.querySelectorAll('[data-count]').forEach(animateCount);
        revealObserver.unobserve(el);
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
$$('.reveal').forEach((el) => revealObserver.observe(el));
/* ------------------------------------------------------- opening hours status */
const toMinutes = (time) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};
const prettyTime = (time) => {
    const [h, m] = time.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return m ? `${hour}:${String(m).padStart(2, '0')} ${suffix}` : `${hour} ${suffix}`;
};
function shopStatus(now = new Date()) {
    if (!SITE.hours.length)
        return null;
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
                long: left <= 60
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
function updateStatus() {
    const status = shopStatus();
    if (!status)
        return;
    $$('.status-pill').forEach((pill) => {
        pill.classList.toggle('is-open', status.open);
        pill.classList.toggle('is-closed', !status.open);
        const text = pill.querySelector('.status-text');
        if (text)
            text.textContent = status.short;
    });
    const inline = document.getElementById('statusInline');
    if (inline) {
        inline.textContent = status.long;
        inline.classList.toggle('is-open', status.open);
        inline.classList.toggle('is-closed', !status.open);
    }
    /* Mark today's row in every hours table on the page. */
    const weekday = new Date().getDay();
    $$('[data-hours-list] li').forEach((li) => {
        li.classList.toggle('is-today', Number(li.dataset.weekday) === weekday);
    });
}
updateStatus();
window.setInterval(updateStatus, 60000);
/* ----------------------------------------------------------- hero cursor glow */
const hero = $('.hero');
const cursorGlow = document.getElementById('cursorGlow');
if (hero && cursorGlow && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        cursorGlow.style.setProperty('--x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        cursorGlow.style.setProperty('--y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
}
/* ------------------------------------------------------------- the film strip */
/* Clips only load and play while they're on screen — the page stays light and
   quiet for anyone who never scrolls that far. */
const reels = $$('video[data-autoplay]');
if (reels.length) {
    const reelObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting && !reduceMotion) {
                if (video.preload === 'none')
                    video.preload = 'auto';
                void video.play().catch(() => {
                    /* a browser that refuses autoplay just shows the poster */
                });
            }
            else {
                video.pause();
            }
        });
    }, { threshold: 0.35 });
    reels.forEach((video) => reelObserver.observe(video));
}
/* ------------------------------------------------------- hero parallax drift */
const heroMedia = $('.hero-video');
if (heroMedia && !reduceMotion) {
    window.addEventListener('scroll', () => {
        const y = Math.min(window.scrollY, window.innerHeight);
        heroMedia.style.transform = `scale(${1 + y * 0.00022}) translateY(${y * 0.12}px)`;
    }, { passive: true });
}
/* ------------------------------------------------------------- section rail */
/* A quiet marker down the left edge: which part of the page you're in, and how
   far through it. Desktop only — CSS hides it on touch. */
const railSections = $$('[data-rail]');
if (railSections.length) {
    const rail = document.createElement('div');
    rail.className = 'rail';
    rail.setAttribute('aria-hidden', 'true');
    rail.innerHTML = '<span class="rail-line"></span><span class="rail-label"></span>';
    document.body.appendChild(rail);
    const label = rail.querySelector('.rail-label');
    const line = rail.querySelector('.rail-line');
    const updateRail = () => {
        var _a;
        const middle = window.scrollY + window.innerHeight * 0.4;
        let current = null;
        railSections.forEach((section) => {
            if (section.offsetTop <= middle)
                current = section;
        });
        if (!current) {
            rail.classList.remove('is-visible');
            return;
        }
        const section = current;
        rail.classList.add('is-visible');
        const name = (_a = section.dataset.rail) !== null && _a !== void 0 ? _a : '';
        if (label && label.textContent !== name)
            label.textContent = name;
        const through = (middle - section.offsetTop) / Math.max(section.offsetHeight, 1);
        line === null || line === void 0 ? void 0 : line.style.setProperty('--rail-progress', `${Math.max(0, Math.min(through, 1)) * 100}%`);
    };
    updateRail();
    window.addEventListener('scroll', updateRail, { passive: true });
    window.addEventListener('resize', updateRail);
}
/* ------------------------------------------------ service menu filter + search */
const menuList = document.getElementById('menuList');
if (menuList) {
    const rows = $$('#menuList .menu-row');
    const groupBlocks = $$('[data-group-block]');
    const chips = $$('[data-filter]');
    const search = $('#serviceSearch');
    const empty = document.getElementById('filterEmpty');
    let group = 'all';
    const apply = () => {
        const term = (search ? search.value : '').trim().toLowerCase();
        let shown = 0;
        rows.forEach((row) => {
            var _a;
            const matchesGroup = group === 'all' || row.dataset.group === group;
            const matchesTerm = !term || ((_a = row.dataset.name) !== null && _a !== void 0 ? _a : '').toLowerCase().includes(term);
            const visible = matchesGroup && matchesTerm;
            row.hidden = !visible;
            if (visible)
                shown += 1;
        });
        /* A heading with nothing under it is just noise. */
        groupBlocks.forEach((block) => {
            const visibleRows = block.querySelectorAll('.menu-row:not([hidden])').length;
            block.hidden = visibleRows === 0;
        });
        if (empty)
            empty.hidden = shown > 0;
    };
    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            var _a;
            group = (_a = chip.dataset.filter) !== null && _a !== void 0 ? _a : 'all';
            chips.forEach((c) => {
                const active = c === chip;
                c.classList.toggle('is-active', active);
                c.setAttribute('aria-selected', String(active));
            });
            apply();
        });
    });
    search === null || search === void 0 ? void 0 : search.addEventListener('input', apply);
    /* The pinned preview: hovering or focusing a row changes the picture beside
       the list, instead of a thumbnail chasing the cursor over the words. */
    const previewImg = $('#menuPreviewImg');
    const previewKicker = document.getElementById('menuPreviewKicker');
    const previewTitle = document.getElementById('menuPreviewTitle');
    const previewMeta = document.getElementById('menuPreviewMeta');
    const previewCard = document.getElementById('menuPreview');
    if (previewImg && previewCard) {
        const showRow = (row) => {
            var _a, _b;
            const src = row.dataset.preview;
            if (src && previewImg.getAttribute('src') !== src) {
                previewCard.classList.add('is-swapping');
                previewImg.src = src;
                window.setTimeout(() => previewCard.classList.remove('is-swapping'), 220);
            }
            if (previewKicker)
                previewKicker.textContent = (_a = row.dataset.group) !== null && _a !== void 0 ? _a : '';
            if (previewTitle)
                previewTitle.textContent = (_b = row.dataset.service) !== null && _b !== void 0 ? _b : '';
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
    const tiles = $$('#galleryGrid .gallery-item');
    const filterChips = $$('[data-gallery-filter]');
    filterChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            var _a;
            const filter = (_a = chip.dataset.galleryFilter) !== null && _a !== void 0 ? _a : 'all';
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
    const lightboxImg = $('#lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const rail = document.getElementById('lightboxRail');
    let index = 0;
    let lastFocused = null;
    const visibleTiles = () => tiles.filter((t) => !t.hidden);
    /* A strip of thumbnails along the bottom: where you are in the set, and a way
       to jump straight to a photo instead of arrowing through everything. */
    const buildRail = (list) => {
        if (!rail)
            return;
        rail.replaceChildren();
        list.forEach((tile, i) => {
            const source = tile.querySelector('img');
            if (!source)
                return;
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
    const show = (i) => {
        var _a;
        const list = visibleTiles();
        if (!list.length || !lightboxImg)
            return;
        index = (i + list.length) % list.length;
        const img = list[index].querySelector('img');
        if (!img)
            return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (caption)
            caption.textContent = `${img.alt} — ${index + 1} of ${list.length}`;
        if (rail) {
            Array.from(rail.children).forEach((thumb, t) => {
                thumb.classList.toggle('is-active', t === index);
            });
            (_a = rail.children[index]) === null || _a === void 0 ? void 0 : _a.scrollIntoView({
                block: 'nearest',
                inline: 'center',
                behavior: reduceMotion ? 'auto' : 'smooth',
            });
        }
    };
    const open = (i) => {
        var _a;
        if (!lightbox)
            return;
        lastFocused = document.activeElement;
        lightbox.hidden = false;
        document.body.classList.add('nav-open');
        buildRail(visibleTiles());
        show(i);
        (_a = $('#lightboxClose')) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const close = () => {
        if (!lightbox)
            return;
        lightbox.hidden = true;
        document.body.classList.remove('nav-open');
        lastFocused === null || lastFocused === void 0 ? void 0 : lastFocused.focus();
    };
    tiles.forEach((tile) => {
        tile.addEventListener('click', () => open(visibleTiles().indexOf(tile)));
    });
    (_a = $('#lightboxClose')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', close);
    (_b = $('#lightboxPrev')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => show(index - 1));
    (_c = $('#lightboxNext')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => show(index + 1));
    lightbox === null || lightbox === void 0 ? void 0 : lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox)
            close();
    });
    document.addEventListener('keydown', (e) => {
        if (!lightbox || lightbox.hidden)
            return;
        if (e.key === 'Escape')
            close();
        if (e.key === 'ArrowRight')
            show(index + 1);
        if (e.key === 'ArrowLeft')
            show(index - 1);
    });
    /* Swipe on touch screens. */
    let touchX = 0;
    lightbox === null || lightbox === void 0 ? void 0 : lightbox.addEventListener('touchstart', (e) => {
        touchX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox === null || lightbox === void 0 ? void 0 : lightbox.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50)
            show(dx < 0 ? index + 1 : index - 1);
    }, { passive: true });
}
/* ------------------------------------------------------------- FAQ accordion */
$$('.faq-q').forEach((button) => {
    var _a;
    const panel = document.getElementById((_a = button.getAttribute('aria-controls')) !== null && _a !== void 0 ? _a : '');
    if (!panel)
        return;
    button.addEventListener('click', () => {
        var _a;
        const isOpen = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!isOpen));
        panel.hidden = isOpen;
        (_a = button.closest('.faq-item')) === null || _a === void 0 ? void 0 : _a.classList.toggle('is-open', !isOpen);
    });
});
/* Landing on #faq-3 should open that answer. */
if (location.hash.indexOf('#faq-') === 0) {
    const item = document.querySelector(location.hash);
    (_d = item === null || item === void 0 ? void 0 : item.querySelector('.faq-q')) === null || _d === void 0 ? void 0 : _d.click();
}
/* --------------------------------------------------------------- review slider */
const reviewTrack = document.getElementById('reviewTrack');
const reviewDots = document.getElementById('reviewDots');
if (reviewTrack && reviewDots) {
    const cards = Array.from(reviewTrack.children);
    let current = 0;
    let timer = 0;
    const go = (i) => {
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
    const start = () => {
        if (reduceMotion || cards.length < 2)
            return;
        timer = window.setInterval(() => go(current + 1), 6000);
    };
    const stop = () => window.clearInterval(timer);
    reviewTrack.addEventListener('mouseenter', stop);
    reviewTrack.addEventListener('mouseleave', start);
    go(0);
    start();
}
/* ------------------------------------------------------------- booking form */
const bookingForm = $('#bookingForm');
if (bookingForm) {
    const nameInput = $('#bookName');
    const phoneInput = $('#bookPhone');
    const serviceInput = $('#bookService');
    const barberInput = $('#bookBarber');
    const dateInput = $('#bookDate');
    const timeInput = $('#bookTime');
    const notesInput = $('#bookNotes');
    const status = document.getElementById('bookStatus');
    const preview = document.getElementById('bookPreview');
    const previewText = document.getElementById('bookPreviewText');
    const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const todayIso = iso(new Date());
    if (dateInput) {
        dateInput.min = todayIso;
        const horizon = new Date();
        horizon.setMonth(horizon.getMonth() + 3);
        dateInput.max = iso(horizon);
    }
    /* Deep links from the menu and the team page: book.html?service=…&barber=… */
    const params = new URLSearchParams(location.search);
    const preselect = (select, value) => {
        if (!select || !value)
            return;
        const match = Array.from(select.options).find((o) => o.value.toLowerCase() === value.toLowerCase());
        if (match)
            select.value = match.value;
    };
    preselect(serviceInput, params.get('service'));
    preselect(barberInput, params.get('barber'));
    const setError = (field, show) => {
        if (!field)
            return;
        const message = document.querySelector(`[data-error-for="${field.id}"]`);
        if (message)
            message.hidden = !show;
        field.classList.toggle('has-error', show);
        field.setAttribute('aria-invalid', String(show));
    };
    /** A chosen slot has to fall inside that day's opening hours. */
    const slotIsOpen = (dateValue, timeValue) => {
        if (!SITE.hours.length)
            return true;
        const day = SITE.hours[new Date(`${dateValue}T00:00`).getDay()];
        if (!day || !day.open || !day.close)
            return false;
        const minutes = toMinutes(timeValue);
        return minutes >= toMinutes(day.open) && minutes < toMinutes(day.close);
    };
    const buildMessage = () => {
        const lines = [
            `New booking request — ${SITE.name}`,
            '',
            `Name: ${nameInput ? nameInput.value.trim() : ''}`,
            `Phone: ${phoneInput ? phoneInput.value.trim() : ''}`,
            `Service: ${serviceInput ? serviceInput.value : ''}`,
        ];
        if (barberInput && barberInput.value)
            lines.push(`Barber: ${barberInput.value}`);
        lines.push(`When: ${dateInput ? dateInput.value : ''} at ${timeInput ? timeInput.value : ''}`);
        if (notesInput && notesInput.value.trim())
            lines.push(`Notes: ${notesInput.value.trim()}`);
        lines.push('', 'Sent from the website.');
        return lines.join('\n');
    };
    const validate = () => {
        var _a, _b;
        const nameOk = ((_a = nameInput === null || nameInput === void 0 ? void 0 : nameInput.value.trim().length) !== null && _a !== void 0 ? _a : 0) > 1;
        const phoneOk = ((_b = phoneInput === null || phoneInput === void 0 ? void 0 : phoneInput.value.replace(/\D/g, '').length) !== null && _b !== void 0 ? _b : 0) >= 8;
        const serviceOk = Boolean(serviceInput && serviceInput.value);
        const dateOk = Boolean(dateInput && dateInput.value && dateInput.value >= todayIso);
        const timeOk = Boolean(timeInput && timeInput.value) &&
            dateOk &&
            slotIsOpen(dateInput.value, timeInput.value);
        setError(nameInput, !nameOk);
        setError(phoneInput, !phoneOk);
        setError(serviceInput, !serviceOk);
        setError(dateInput, !dateOk);
        setError(timeInput, !timeOk);
        const checks = [
            [nameOk, nameInput],
            [phoneOk, phoneInput],
            [serviceOk, serviceInput],
            [dateOk, dateInput],
            [timeOk, timeInput],
        ];
        const firstBad = checks.find(([ok]) => !ok);
        if (firstBad && firstBad[1])
            firstBad[1].focus();
        return nameOk && phoneOk && serviceOk && dateOk && timeOk;
    };
    const showPreview = (message, note) => {
        if (previewText)
            previewText.textContent = message;
        if (preview)
            preview.hidden = false;
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
        showPreview(message, 'WhatsApp is opening with your request. Press send there — it is not booked until you do, and we reply to confirm.');
        window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });
    (_e = $('#bookSms')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => {
        if (!validate())
            return;
        const message = buildMessage();
        showPreview(message, 'Your messages app is opening. Press send there to finish the request.');
        location.href = `sms:${SITE.phone}?&body=${encodeURIComponent(message)}`;
    });
    (_f = $('#bookCopy')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', () => {
        if (!validate())
            return;
        const message = buildMessage();
        navigator.clipboard
            .writeText(message)
            .then(() => showPreview(message, 'Copied. Paste it into WhatsApp, a message, or an email to the shop.'))
            .catch(() => showPreview(message, 'Copy the text below and send it to the shop however suits you.'));
    });
    /* Clear an error as soon as the visitor fixes it. */
    [nameInput, phoneInput, serviceInput, dateInput, timeInput].forEach((field) => {
        field === null || field === void 0 ? void 0 : field.addEventListener('input', () => setError(field, false));
    });
    /* Returning customers shouldn't retype their own name and number. Stored on
       this device only, and only after they've actually sent a request. */
    const REMEMBER_KEY = 'escape.customer';
    try {
        const saved = localStorage.getItem(REMEMBER_KEY);
        if (saved) {
            const { name, phone } = JSON.parse(saved);
            if (nameInput && name && !nameInput.value)
                nameInput.value = name;
            if (phoneInput && phone && !phoneInput.value)
                phoneInput.value = phone;
        }
    }
    catch {
        /* private browsing, or storage turned off — just show an empty form */
    }
    const remember = () => {
        try {
            localStorage.setItem(REMEMBER_KEY, JSON.stringify({ name: nameInput === null || nameInput === void 0 ? void 0 : nameInput.value.trim(), phone: phoneInput === null || phoneInput === void 0 ? void 0 : phoneInput.value.trim() }));
        }
        catch {
            /* nothing to do — remembering is a convenience, not a requirement */
        }
    };
    bookingForm.addEventListener('submit', remember);
    (_g = $('#bookSms')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', remember);
    /* An .ics the visitor can drop into their own calendar. It's marked
       tentative, because the shop hasn't confirmed anything yet. */
    const pad = (n) => String(n).padStart(2, '0');
    const stamp = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    (_h = $('#bookCalendar')) === null || _h === void 0 ? void 0 : _h.addEventListener('click', () => {
        var _a, _b;
        if (!(dateInput === null || dateInput === void 0 ? void 0 : dateInput.value) || !(timeInput === null || timeInput === void 0 ? void 0 : timeInput.value) || !(serviceInput === null || serviceInput === void 0 ? void 0 : serviceInput.value))
            return;
        const start = new Date(`${dateInput.value}T${timeInput.value}`);
        const minutes = Number((_b = (_a = serviceInput.selectedOptions[0]) === null || _a === void 0 ? void 0 : _a.dataset.minutes) !== null && _b !== void 0 ? _b : '30');
        const end = new Date(start.getTime() + minutes * 60000);
        const barber = (barberInput === null || barberInput === void 0 ? void 0 : barberInput.value) ? ` with ${barberInput.value}` : '';
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
(_j = $('#printMenu')) === null || _j === void 0 ? void 0 : _j.addEventListener('click', () => window.print());
