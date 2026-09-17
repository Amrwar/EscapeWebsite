'use client';

import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = ref.current;
    const hero = glow?.closest<HTMLElement>('.hero');
    if (!glow || !hero) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    function onMove(e: MouseEvent) {
      const rect = hero!.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      glow!.style.setProperty('--x', `${x}%`);
      glow!.style.setProperty('--y', `${y}%`);
    }

    hero.addEventListener('mousemove', onMove);
    return () => hero.removeEventListener('mousemove', onMove);
  }, []);

  return <div className="cursor-glow" ref={ref}></div>;
}
