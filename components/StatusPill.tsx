'use client';

import { useEffect, useState } from 'react';

type DayHours = [openHour: number, closeHour: number];

const HOURS: Record<number, DayHours> = {
  0: [11, 18], // Sunday
  1: [10, 21], // Monday
  2: [10, 21],
  3: [10, 21],
  4: [10, 21],
  5: [10, 21],
  6: [10, 20], // Saturday
};

function getStatus(): { isOpen: boolean; text: string } {
  const now = new Date();
  const [openHour, closeHour] = HOURS[now.getDay()];
  const isOpen = now.getHours() >= openHour && now.getHours() < closeHour;
  const text = isOpen
    ? `Open now · closes ${closeHour > 12 ? closeHour - 12 : closeHour}${closeHour >= 12 ? 'PM' : 'AM'}`
    : `Closed · opens ${openHour}${openHour >= 12 ? 'PM' : 'AM'}`;
  return { isOpen, text };
}

export default function StatusPill() {
  const [status, setStatus] = useState<{ isOpen: boolean; text: string } | null>(null);

  useEffect(() => {
    setStatus(getStatus());
    const interval = setInterval(() => setStatus(getStatus()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <li className={`status-pill${status ? (status.isOpen ? ' is-open' : ' is-closed') : ''}`}>
      <span className="status-dot"></span>
      <span>{status ? status.text : 'Checking hours…'}</span>
    </li>
  );
}
