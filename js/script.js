document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* Highlight the nav link for the current page */
const currentPage = location.pathname.split('/').pop() || 'index.html';
navLinks.querySelectorAll('a[data-page]').forEach(link => {
  if (link.dataset.page === currentPage) link.classList.add('active');
});

/* Sticky header on scroll */
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* Scroll-reveal + number count-up */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      entry.target.querySelectorAll('[data-count]').forEach(animateCount);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Live open/closed status, computed from real hours in the visitor's local time */
const HOURS = {
  0: [11, 18],   // Sunday
  1: [10, 21],   // Monday
  2: [10, 21],
  3: [10, 21],
  4: [10, 21],
  5: [10, 21],
  6: [10, 20],   // Saturday
};

function updateStatus() {
  const pill = document.getElementById('statusPill');
  const text = document.getElementById('statusText');
  if (!pill || !text) return;
  const now = new Date();
  const [openHour, closeHour] = HOURS[now.getDay()];
  const isOpen = now.getHours() >= openHour && now.getHours() < closeHour;
  pill.classList.toggle('is-open', isOpen);
  pill.classList.toggle('is-closed', !isOpen);
  text.textContent = isOpen
    ? `Open now · closes ${closeHour > 12 ? closeHour - 12 : closeHour}${closeHour >= 12 ? 'PM' : 'AM'}`
    : `Closed · opens ${openHour}${openHour >= 12 ? 'PM' : 'AM'}`;
}
updateStatus();
setInterval(updateStatus, 60000);

/* Cursor-follow glow in the hero (pointer devices only) */
const hero = document.querySelector('.hero');
const cursorGlow = document.getElementById('cursorGlow');
if (hero && cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cursorGlow.style.setProperty('--x', `${x}%`);
    cursorGlow.style.setProperty('--y', `${y}%`);
  });
}
