import { esc, waLink } from '../../tools/layout.mjs';
import { hoursTable } from '../../tools/components.mjs';

/**
 * The booking page. There's no server behind this site, so the form doesn't
 * pretend to "send" anything: it validates what you typed, then hands it to
 * WhatsApp (or SMS) as a written-out message the shop can reply to. That way a
 * request that says it was sent really was sent.
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
  <p>Fill this in and it opens WhatsApp with your request written out — send it and we reply with a confirmation. Prefer to talk? <a class="text-link" href="tel:${esc(site.phoneHref)}">Call ${esc(site.phoneDisplay)}</a>.</p>
</section>

<section class="booking">
  <form class="booking-form reveal" id="bookingForm" novalidate>
    <div class="field">
      <label for="bookName">Your name</label>
      <input type="text" id="bookName" name="name" autocomplete="name" required placeholder="e.g. Amr Hefny">
      <p class="field-error" data-error-for="bookName" hidden>Please tell us your name.</p>
    </div>

    <div class="field">
      <label for="bookPhone">Phone number</label>
      <input type="tel" id="bookPhone" name="phone" autocomplete="tel" required inputmode="tel" placeholder="01x xxxx xxxx">
      <p class="field-error" data-error-for="bookPhone" hidden>We need a number to confirm on — at least 8 digits.</p>
    </div>

    <div class="field">
      <label for="bookService">Service</label>
      <select id="bookService" name="service" required>
        <option value="">Choose a service…</option>
        ${serviceOptions
          .map((s) => `<option value="${esc(s.name)}" data-minutes="${s.minutes}">${esc(s.name)}</option>`)
          .join('\n        ')}
      </select>
      <p class="field-error" data-error-for="bookService" hidden>Pick a service so we set aside the right amount of time.</p>
    </div>

    <div class="field">
      <label for="bookBarber">Barber <span class="field-optional">optional</span></label>
      <select id="bookBarber" name="barber">
        <option value="">No preference</option>
        ${site.team.map((m) => `<option value="${esc(m.name)}">${esc(m.name)} — ${esc(m.role)}</option>`).join('\n        ')}
      </select>
    </div>

    <div class="field">
      <label for="bookDate">Date</label>
      <input type="date" id="bookDate" name="date" required>
      <p class="field-error" data-error-for="bookDate" hidden>Pick a day we're open — the hours are listed beside this form.</p>
    </div>

    <div class="field">
      <label for="bookTime">Time</label>
      <input type="time" id="bookTime" name="time" required step="900">
      <p class="field-error" data-error-for="bookTime" hidden>Choose a time inside that day's opening hours.</p>
    </div>

    <div class="field field-wide">
      <label for="bookNotes">Anything we should know? <span class="field-optional">optional</span></label>
      <textarea id="bookNotes" name="notes" rows="3" placeholder="First visit, bringing my son, need to be out by 7…"></textarea>
    </div>

    <div class="field field-wide form-actions">
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
    <div class="aside-block reveal">
      <h3 class="block-title">Opening hours</h3>
      ${hoursTable(site, { compact: true })}
      <p class="cta-note" style="text-align:left">The form won't let you pick a time we're shut.</p>
    </div>
    <div class="aside-block reveal">
      <h3 class="block-title">How it works</h3>
      <ol class="step-list">
        <li><strong>Send the request.</strong> It arrives on the shop's WhatsApp, written out in full.</li>
        <li><strong>We confirm.</strong> Usually within the hour we're open — we'll say if that slot is taken and offer the nearest one.</li>
        <li><strong>Turn up.</strong> Arrive five minutes early and the chair is warm.</li>
      </ol>
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
