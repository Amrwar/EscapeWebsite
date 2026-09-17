export default function BarberChair() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* pedestal base */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.65} roughness={0.3} />
      </mesh>
      {/* pedestal column */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.7, 20]} />
        <meshStandardMaterial color="#202020" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* seat */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.58, 0.62, 0.24, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.25} roughness={0.55} />
      </mesh>
      {/* backrest */}
      <mesh position={[0, 0.55, -0.42]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[0.9, 1.25, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.25} roughness={0.55} />
      </mesh>
      {/* headrest */}
      <mesh position={[0, 1.22, -0.5]} rotation={[0.18, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.32, 20]} />
        <meshStandardMaterial color="#1e1e1e" metalness={0.35} roughness={0.4} />
      </mesh>
      {/* armrests */}
      <mesh position={[-0.56, 0.15, -0.1]}>
        <boxGeometry args={[0.14, 0.14, 0.68]} />
        <meshStandardMaterial color="#1e1e1e" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0.56, 0.15, -0.1]}>
        <boxGeometry args={[0.14, 0.14, 0.68]} />
        <meshStandardMaterial color="#1e1e1e" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}
