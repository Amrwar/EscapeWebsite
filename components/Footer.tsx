import Link from 'next/link';
import SocialIcons from './SocialIcons';
import Year from './Year';

export default function Footer() {
  return (
    <footer className="site-footer">
      <img src="/images/logo.png" alt="Escape Barbershop" className="footer-logo" />
      <div className="footer-links">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/services">Services</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/visit">Visit</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <SocialIcons />
      <p>
        &copy; <Year /> Escape Barbershop. All rights reserved.
      </p>
    </footer>
  );
}
