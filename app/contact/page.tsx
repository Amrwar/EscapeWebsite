import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import SocialIcons from '@/components/SocialIcons';

export const metadata: Metadata = {
  title: 'Contact — Escape Barbershop',
  description: 'Get in touch with Escape Barbershop — phone, email, and social.',
};

export default function ContactPage() {
  return (
    <>
      <section className="page-header">
        <p className="eyebrow center">Contact</p>
        <h1>
          Let&apos;s <em>Talk</em>
        </h1>
        <p>
          Questions, group bookings, or just want to check something before you come by — reach
          out.
        </p>
      </section>

      <section className="contact">
        <Reveal className="contact-info">
          <h3>Reach Us Directly</h3>
          <a href="tel:+10000000000" className="big-link">
            +1 (000) 000-0000
          </a>
          <a href="mailto:hello@escapebarbershop.com" className="big-link">
            hello@escapebarbershop.com
          </a>
          <p style={{ marginTop: '1.6rem' }}>
            Mivida, Eterna Mall
            <br />
            Gate 2
          </p>
          <Link href="/visit" className="text-link">
            Hours &amp; directions →
          </Link>

          <SocialIcons large />
        </Reveal>
      </section>

      <section className="cta-strip" id="book">
        <p className="eyebrow center">Book Your Visit</p>
        <h2>
          Prefer to just <em>call?</em>
        </h2>
        <p>Walk-ins welcome. Regulars preferred. Book ahead to skip the wait.</p>
        <div className="hero-actions center">
          <a href="tel:+10000000000" className="btn btn-primary">
            Call to Book
          </a>
          <Link href="/visit" className="btn btn-ghost">
            Get Directions
          </Link>
        </div>
      </section>
    </>
  );
}
