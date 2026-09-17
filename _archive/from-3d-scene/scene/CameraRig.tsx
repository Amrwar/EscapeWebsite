'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export default function CameraRig({ still = false }: { still?: boolean }) {
  const t = useRef(0);
  const { camera, pointer } = useThree();

  useFrame((_, delta) => {
    t.current += delta;
    const autoAngle = still ? 0 : t.current * 0.06;
    const targetX = Math.sin(autoAngle) * 0.5 + pointer.x * 0.35;
    const targetY = 0.4 + pointer.y * 0.15;

    camera.position.x += (targetX - camera.position.x) * 0.025;
    camera.position.y += (targetY - camera.position.y) * 0.025;
    camera.lookAt(0, 0.3, -2.3);
  });

  return null;
}
