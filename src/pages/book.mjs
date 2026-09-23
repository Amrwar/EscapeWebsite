import { esc, waLink } from '../../tools/layout.mjs';
import { hoursTable } from '../../tools/components.mjs';

/**
 * The booking page. There's no server behind this site, so the form doesn't
 * pretend to "send" anything: it validates what you typed, then hands it to
 * WhatsApp (or SMS) as a written-out message the shop can reply to. That way a
 * request that says it was sent really was sent.
 *
 * The fields are grouped the way you'd be asked in person — who you are, what
 * you want, when — and a card beside them keeps the request in view as it takes
 * shape.
 */
export default function book(site) {
  const serviceOptions = [
    ...site.packages.map((p) => ({ name: p.name, minutes: 90 })),
    ...site.services.map((s) => ({ name: s.name, minutes: s.minutes })),
  ];
  return {
    file: 'book.html',
    title: `Book an Appointment — ${site.name}`,
    description:
      'Request an appointment at Escape Barbershop — pick your service, barber and time, and we confirm on WhatsApp.',
    body: `
<section class="page-header">
  <p class="eyebrow center">Booking</p>
  <h1>Reserve your <em>chair</em></h1>
  <p>Three steps, under a minute. It opens WhatsApp with your request written out — send it there and we reply to confirm. Prefer to talk? <a class="text-link" href="tel:${esc(site.phoneHref)}">Call ${esc(site.phoneDisplay)}</a>.</p>
</section>

<section class="booking" data-rail="Booking">
  <form class="booking-form reveal" id="bookingForm" novalidate>
    <fieldset class="field-group">
      <legend><span class="step-num">01</span> Who you are</legend>
      <div class="field-row">
        <div class="field">
          <label for="bookName">Your name</label>
          <input type="text" id="bookName" name="name" autocomplete="name" required placeholder="e.g. Mohamed Ahmed">
          <p class="field-error" data-error-for="bookName" hidden>Please tell us your name.</p>
        </div>
        <div class="field">
          <label for="bookPhone">Phone number</label>
          <input type="tel" id="bookPhone" name="phone" autocomplete="tel" required inputmode="tel" placeholder="01x xxxx xxxx">
          <p class="field-error" data-error-for="bookPhone" hidden>We need a number to confirm on — at least 8 digits.</p>
        </div>
      </div>
    </fieldset>

    <fieldset class="field-group">
      <legend><span class="step-num">02</span> What you're after</legend>
      <div class="field-row">
        <div class="field">
          <label for="bookService">Service</label>
          <select id="bookService" name="service" required>
            <option value="">Choose a service…</option>
            ${serviceOptions
              .map((s) => `<option value="${esc(s.name)}" data-minutes="${s.minutes}">${esc(s.name)}</option>`)
              .join('\n            ')}
          </select>
          <p class="field-error" data-error-for="bookService" hidden>Pick a service so we set aside the right amount of time.</p>
        </div>
        <div class="field">
          <label for="bookBarber">Barber <span class="field-optional">optional</span></label>
          <select id="bookBarber" name="barber">
            <option value="">No preference</option>
            ${site.team
              .map((m) => `<option value="${esc(m.name)}">${esc(m.name)} — ${esc(m.role)}</option>`)
              .join('\n            ')}
          </select>
        </div>
      </div>
    </fieldset>

    <fieldset class="field-group">
      <legend><span class="step-num">03</span> When suits you</legend>
      <div class="field-row">
        <div class="field">
          <label for="bookDate">Date</label>
          <input type="date" id="bookDate" name="date" required>
          <p class="field-error" data-error-for="bookDate" hidden>Pick a day we're open — the hours are listed beside this form.</p>
        </div>
        <div class="field">
          <label for="bookTime">Time</label>
          <input type="time" id="bookTime" name="time" required step="900">
          <div class="slot-grid" id="slotGrid" hidden></div>
          <p class="slot-note" id="slotNote" hidden>Pick a barber and a date to see times that are already taken.</p>
          <p class="field-error" data-error-for="bookTime" hidden>Choose a time inside that day's opening hours.</p>
        </div>
      </div>
      <div class="field">
        <label for="bookNotes">Anything we should know? <span class="field-optional">optional</span></label>
        <textarea id="bookNotes" name="notes" rows="3" placeholder="First visit, bringing my son, need to be out by 7…"></textarea>
      </div>
    </fieldset>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary">Send Request on WhatsApp</button>
      <button type="button" class="btn btn-ghost" id="bookSms">Send by SMS instead</button>
      <button type="button" class="btn btn-ghost" id="bookCopy">Copy the request</button>
    </div>

    <p class="form-status" id="bookStatus" role="status" aria-live="polite"></p>

    <div class="form-preview" id="bookPreview" hidden>
      <h3>What we'll receive</h3>
      <pre id="bookPreviewText"></pre>
      <div class="preview-actions">
        <button type="button" class="btn btn-ghost" id="bookCalendar">Add to My Calendar</button>
        <span class="preview-note">Saves a provisional entry — the shop still confirms by reply.</span>
      </div>
    </div>
  </form>

  <aside class="booking-aside">
    <p class="aside-note" id="bookNote" hidden></p>

    <div class="summary-card reveal" id="bookSummary">
      <h3 class="block-title">Your request</h3>
      <dl class="summary-list">
        <div><dt>Service</dt><dd data-summary="service">—</dd></div>
        <div><dt>Barber</dt><dd data-summary="barber">Whoever is free</dd></div>
        <div><dt>When</dt><dd data-summary="when">—</dd></div>
        <div><dt>In the chair</dt><dd data-summary="minutes">—</dd></div>
      </dl>
      <p class="summary-note">Nothing is booked until the shop replies.</p>
    </div>

    <div class="aside-block reveal">
      <h3 class="block-title">Opening hours</h3>
      ${hoursTable(site, { compact: true })}
      <p class="cta-note" style="text-align:left">The form won't let you pick a time we're shut.</p>
    </div>

    <div class="aside-block reveal">
      <h3 class="block-title">In a hurry?</h3>
      <p class="footer-text">Walk in — you'll usually be seen. Evenings and weekends are the busy stretch.</p>
      <a class="btn btn-ghost" href="${esc(waLink(site, `Hi ${site.name}, do you have a chair free right now?`))}" target="_blank" rel="noopener">Ask if a chair is free</a>
    </div>
  </aside>
</section>
`,
  };
}
