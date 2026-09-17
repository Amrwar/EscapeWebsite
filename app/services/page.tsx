import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Services — Escape Barbershop',
  description: 'The full menu at Escape Barbershop — fades, beard sculpting, hot towel shaves, and more.',
};

const SERVICES = [
  {
    num: '01',
    title: 'Signature Fade',
    desc: 'Precision clipper work tailored to your face shape, finished with a razor edge.',
  },
  {
    num: '02',
    title: 'Beard Sculpt',
    desc: 'Shape, line-up, and hot towel conditioning for a beard that actually holds its line.',
  },
  {
    num: '03',
    title: 'Hot Towel Shave',
    desc: 'The classic straight-razor shave — steam, oils, and a finish smooth enough to notice.',
  },
  {
    num: '04',
    title: 'Pedicure Lounge',
    desc: "Dedicated pedicure area for a full reset — because grooming isn't only above the neck.",
  },
  {
    num: '05',
    title: 'Kids Cuts',
    desc: 'Patient, precise cuts for the next generation of regulars.',
  },
  {
    num: '06',
    title: 'Full Groom',
    desc: 'Cut, beard, and shave in one sitting — the complete Escape experience.',
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="page-header">
        <p className="eyebrow center">Services</p>
        <h1>
          Crafted, <em>Not Rushed</em>
        </h1>
        <p>Every service ends with a straight-razor finish. No exceptions, no shortcuts.</p>
      </section>

      <section className="services">
        <div className="menu-list">
          {SERVICES.map((s) => (
            <Reveal className="menu-row" key={s.num}>
              <span className="menu-num">{s.num}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="cta-strip" id="book">
        <p className="eyebrow center">Book Your Visit</p>
        <h2>
          Reserve your <em>chair</em>
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
