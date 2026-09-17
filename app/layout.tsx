import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Escape Barbershop',
  description: 'Escape Barbershop — modern grooming, classic craft.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%230a0a0a'/%3E%3Ccircle cx='32' cy='17' r='7' fill='%23ffffff'/%3E%3Cpath d='M32 24 L32 43 M22 33 L42 33 M32 43 L24 57 M32 43 L40 57' stroke='%23ffffff' stroke-width='4' stroke-linecap='round' fill='none'/%3E%3C/svg%3E"
        />
      </head>
      <body>
        <div className="grain"></div>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
