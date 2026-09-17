import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import CinematicSection from '@/components/CinematicSection';

export const metadata: Metadata = {
  title: 'Escape Barbershop — Home',
  description: 'Escape Barbershop — modern grooming, classic craft.',
};

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="cinematic-bg" style={{ backgroundImage: 'url(/images/storefront.jpg)' }} />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <img src="/images/logo.png" alt="Escape Barbershop" className="hero-logo" />
          <p className="eyebrow">Est. in the city</p>
          <h1>
            Where a cut
            <br />
            becomes <em>an escape</em>
          </h1>
          <p className="hero-sub">
            Modern barbering, old-world detail. Fades, beards, straight-razor finishes — in a space
            built to slow you down.
          </p>
          <div className="hero-actions">
            <a href="tel:+10000000000" className="btn btn-primary">
              Book an Appointment
            </a>
            <Link href="/gallery" className="btn btn-ghost">
              Explore the Space
            </Link>
          </div>
        </div>
        <a href="#story" className="scroll-cue" aria-label="Scroll down">
          <span></span>
        </a>
      </section>

      <div id="story" />

      <CinematicSection
        image="/images/barber-chairs.jpg"
        alt="Row of barber chairs inside Escape Barbershop"
        eyebrow="The Craft"
        heading={
          <>
            Precision in <em>every pass</em>
          </>
        }
        sub="Fades, tapers, straight-razor lines — the kind of detail you feel before you see it in the mirror."
      >
        <div className="hero-actions center">
          <Link href="/about" className="btn btn-ghost">
            Our Story
          </Link>
        </div>
      </CinematicSection>

      <CinematicSection
        image="/images/wash-station.jpg"
        alt="Wash basin station at Escape Barbershop"
        eyebrow="The Escape"
        heading={
          <>
            Sit back. <em>Let go.</em>
          </>
        }
        sub="Hot towels, warm light, and nowhere else you need to be for the next forty minutes."
      >
        <div className="hero-actions center">
          <a href="tel:+10000000000" className="btn btn-primary">
            Book an Appointment
          </a>
          <Link href="/visit" className="btn btn-ghost">
            Get Directions
          </Link>
        </div>
      </CinematicSection>

      <div className="divider">
        <span>✦</span>
      </div>

      <section className="services">
        <div className="section-head">
          <p className="eyebrow center">Services</p>
          <h2 className="center">
            Crafted, <em>Not Rushed</em>
          </h2>
        </div>
        <div className="menu-list">
          <Reveal className="menu-row">
            <span className="menu-num">01</span>
            <div>
              <h3>Signature Fade</h3>
              <p>Precision clipper work tailored to your face shape, finished with a razor edge.</p>
            </div>
          </Reveal>
          <Reveal className="menu-row">
            <span className="menu-num">02</span>
            <div>
              <h3>Beard Sculpt</h3>
              <p>Shape, line-up, and hot towel conditioning for a beard that actually holds its line.</p>
            </div>
          </Reveal>
          <Reveal className="menu-row">
            <span className="menu-num">03</span>
            <div>
              <h3>Hot Towel Shave</h3>
              <p>The classic straight-razor shave — steam, oils, and a finish smooth enough to notice.</p>
            </div>
          </Reveal>
        </div>
        <div className="hero-actions center" style={{ marginTop: '3rem' }}>
          <Link href="/services" className="btn btn-ghost">
            View Full Menu
          </Link>
        </div>
      </section>

      <div className="divider">
        <span>✦</span>
      </div>

      <section className="gallery">
        <div className="section-head">
          <p className="eyebrow center">Inside Escape</p>
          <h2 className="center">
            The <em>Space</em>
          </h2>
        </div>
        <div className="gallery-grid">
          <Reveal className="gallery-item">
            <img src="/images/entrance-lights.jpg" alt="Entrance with pendant lighting" loading="lazy" />
          </Reveal>
          <Reveal className="gallery-item">
            <img
              src="/images/pedicure-area.jpg"
              alt="Pedicure area with dark leather chairs"
              loading="lazy"
            />
          </Reveal>
          <Reveal className="gallery-item">
            <img src="/images/wash-station.jpg" alt="Wash basin station" loading="lazy" />
          </Reveal>
        </div>
        <div className="hero-actions center" style={{ marginTop: '3rem' }}>
          <Link href="/gallery" className="btn btn-ghost">
            See Full Gallery
          </Link>
        </div>
      </section>

      <section className="cta-strip" id="book">
        <p className="eyebrow center">Book Your Visit</p>
        <h2>
          Ready for a cut that feels like <em>an escape?</em>
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
