'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import Floor from './Floor';
import BarberChair from './BarberChair';
import Mirror from './Mirror';
import PendantLight from './PendantLight';
import CameraRig from './CameraRig';
import usePrefersReducedMotion from './usePrefersReducedMotion';

export default function BarberScene() {
  const reduceMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  return (
    <div className={`barber-scene${ready ? ' is-ready' : ''}`}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 3.4], fov: 42 }}
        gl={{ antialias: true, powerPreference: 'low-power' }}
        onCreated={() => setReady(true)}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 3, 10.5]} />
        <ambientLight intensity={0.28} />
        <spotLight position={[0, 4.5, 2.5]} angle={0.6} penumbra={1} intensity={1.8} color="#ffffff" />
        <pointLight position={[0, 0.6, 2.6]} intensity={0.9} distance={6} decay={2} color="#ffffff" />
        <pointLight position={[-2, 0.8, 1]} intensity={0.5} distance={6} decay={2} color="#ffffff" />
        <pointLight position={[2, 0.8, 1]} intensity={0.5} distance={6} decay={2} color="#ffffff" />

        <Suspense fallback={null}>
          <Floor />
          <BarberChair />
          <Mirror />
          <PendantLight position={[-1.7, 1.7, -1]} />
          <PendantLight position={[0, 1.9, -1.4]} />
          <PendantLight position={[1.7, 1.7, -1]} />
          <Sparkles count={35} scale={7} size={1.6} speed={0.15} opacity={0.12} color="#ffffff" />
        </Suspense>

        <CameraRig still={reduceMotion} />
      </Canvas>
    </div>
  );
}
