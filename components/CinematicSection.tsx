import type { ReactNode } from 'react';
import Reveal from './Reveal';

export default function CinematicSection({
  image,
  alt,
  eyebrow,
  heading,
  sub,
  children,
}: {
  image: string;
  alt: string;
  eyebrow?: string;
  heading: ReactNode;
  sub?: string;
  children?: ReactNode;
}) {
  return (
    <section className="cinematic" aria-label={alt}>
      <div className="cinematic-bg" style={{ backgroundImage: `url(${image})` }} />
      <div className="cinematic-overlay" />
      <Reveal className="cinematic-content">
        {eyebrow && <p className="eyebrow center">{eyebrow}</p>}
        <h2 className="cinematic-heading">{heading}</h2>
        {sub && <p className="cinematic-sub">{sub}</p>}
        {children}
      </Reveal>
    </section>
  );
}
