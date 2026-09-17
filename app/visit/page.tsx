import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Visit — Escape Barbershop',
  description: 'Hours, location, and contact for Escape Barbershop.',
};

export default function VisitPage() {
  return (
    <>
      <section className="page-header">
        <p className="eyebrow center">Visit</p>
        <h1>
          Come <em>Find Us</em>
        </h1>
        <p>Mivida, Eterna Mall Gate 2.</p>
      </section>

      <section className="visit">
        <div className="visit-grid">
          <Reveal className="visit-block">
            <h3>Hours</h3>
            <ul className="hours-list">
              <li>
                <span>Mon – Fri</span>
                <span>10:00 – 21:00</span>
              </li>
              <li>
                <span>Saturday</span>
                <span>10:00 – 20:00</span>
              </li>
              <li>
                <span>Sunday</span>
                <span>11:00 – 18:00</span>
              </li>
            </ul>
          </Reveal>
          <Reveal className="visit-block">
            <h3>Find Us</h3>
            <p>
              Mivida, Eterna Mall
              <br />
              Gate 2
            </p>
            <a
              href="https://share.google/7Xe5DxwhBiDTLbYOz"
              className="text-link"
              target="_blank"
              rel="noopener"
            >
              Open in Maps →
            </a>
          </Reveal>
          <Reveal className="visit-block">
            <h3>Contact</h3>
            <p>
              <a href="tel:+10000000000">+1 (000) 000-0000</a>
            </p>
            <p>
              <a href="mailto:hello@escapebarbershop.com">hello@escapebarbershop.com</a>
            </p>
            <Link href="/contact" className="text-link">
              Full contact details &amp; socials →
            </Link>
          </Reveal>
        </div>

        <Reveal className="map-frame">
          <iframe
            src="https://www.google.com/maps?q=Mivida+Eterna+Mall+Gate+2&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Escape Barbershop location on Google Maps"
          />
        </Reveal>
        <a
          href="https://share.google/7Xe5DxwhBiDTLbYOz"
          target="_blank"
          rel="noopener"
          className="text-link"
          style={{ display: 'block', textAlign: 'center', marginTop: '1.2rem' }}
        >
          Open in Google Maps →
        </a>
      </section>

      <section className="cta-strip" id="book">
        <p className="eyebrow center">Book Your Visit</p>
        <h2>
          See you <em>soon</em>
        </h2>
        <p>Walk-ins welcome. Regulars preferred. Book ahead to skip the wait.</p>
        <div className="hero-actions center">
          <a href="tel:+10000000000" className="btn btn-primary">
            Call to Book
          </a>
          <Link href="/gallery" className="btn btn-ghost">
            See the Space
          </Link>
        </div>
      </section>
    </>
  );
}
