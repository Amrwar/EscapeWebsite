import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Gallery — Escape Barbershop',
  description: 'Inside Escape Barbershop — the space, the chairs, the details.',
};

export default function GalleryPage() {
  return (
    <>
      <section className="page-header">
        <p className="eyebrow center">Inside Escape</p>
        <h1>
          The <em>Space</em>
        </h1>
        <p>A look at the room — the chairs, the light, the details.</p>
      </section>

      <section className="gallery">
        <div className="gallery-grid">
          <Reveal className="gallery-item">
            <img
              src="/images/storefront.jpg"
              alt="Escape Barbershop illuminated entrance sign"
              loading="lazy"
            />
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
          <Reveal className="gallery-item">
            <img src="/images/barber-chairs.jpg" alt="Row of barber chairs" loading="lazy" />
          </Reveal>
          <Reveal className="gallery-item">
            <img src="/images/entrance-lights.jpg" alt="Entrance with pendant lighting" loading="lazy" />
          </Reveal>
          <Reveal className="gallery-item">
            <img src="/images/corridor.jpg" alt="Corridor leading into Escape Barbershop" loading="lazy" />
          </Reveal>
          <Reveal className="gallery-item">
            <img
              src="/images/floor-overview.jpg"
              alt="Overview of the Escape Barbershop floor"
              loading="lazy"
            />
          </Reveal>
        </div>
      </section>

      <section className="cta-strip" id="book">
        <p className="eyebrow center">Book Your Visit</p>
        <h2>
          Come see it <em>in person</em>
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
