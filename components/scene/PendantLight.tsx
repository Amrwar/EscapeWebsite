export default function PendantLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.5, 6]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color="#fff8ec" emissive="#fff8ec" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      <pointLight intensity={3} distance={7} decay={2} color="#fff2dc" />
    </group>
  );
}
