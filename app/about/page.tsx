import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';

export const metadata: Metadata = {
  title: 'About — Escape Barbershop',
  description: 'The story and space behind Escape Barbershop.',
};

export default function AboutPage() {
  return (
    <>
      <section className="page-header">
        <p className="eyebrow center">The Place</p>
        <h1>
          Not just a barbershop.
          <br />
          <em>An escape.</em>
        </h1>
        <p>
          Built for people who want their grooming ritual to feel like a reset — sharp lines,
          honest service, no rush.
        </p>
      </section>

      <section className="about">
        <Reveal className="about-media">
          <div className="about-frame">
            <div className="frame-inner">
              <img src="/images/storefront.jpg" alt="Escape Barbershop storefront at night" loading="lazy" />
            </div>
          </div>
        </Reveal>
        <Reveal className="about-copy">
          <p className="eyebrow">Our Story</p>
          <h2>
            Slow down. <em>Sit down.</em>
          </h2>
          <p>
            Escape Barbershop started with a simple idea: a haircut shouldn&apos;t feel like an
            errand. We wanted a room where the light is low, the chairs are comfortable, and nobody
            is looking at the clock — a place that feels less like a shop and more like a short trip
            away from everything else.
          </p>
          <p>
            Every station is set up for precision. Every visit ends the same way: you leave looking
            better than you walked in, and feeling like you actually took a break.
          </p>
          <div className="stat-row">
            <div className="stat">
              <CountUp target={5} suffix="+" />
              <span>Chairs &amp; stations</span>
            </div>
            <div className="stat">
              <CountUp target={7} />
              <span>Days a week</span>
            </div>
            <div className="stat">
              <CountUp target={100} suffix="%" />
              <span>Straight-razor finish</span>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="divider">
        <span>✦</span>
      </div>

      <section className="gallery">
        <div className="section-head">
          <p className="eyebrow center">The Details</p>
          <h2 className="center">
            Built for the <em>Ritual</em>
          </h2>
          <p className="lede">
            From the wash basins to the pedicure lounge, every corner of Escape is set up so the
            session — not the schedule — sets the pace.
          </p>
        </div>
        <div className="gallery-grid">
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
      </section>

      <section className="cta-strip">
        <p className="eyebrow center">Next</p>
        <h2>
          See what we <em>offer</em>
        </h2>
        <p>From signature fades to the full hot towel shave.</p>
        <div className="hero-actions center">
          <Link href="/services" className="btn btn-primary">
            View Services
          </Link>
          <Link href="/gallery" className="btn btn-ghost">
            See the Gallery
          </Link>
        </div>
      </section>
    </>
  );
}
