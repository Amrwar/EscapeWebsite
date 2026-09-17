import { MeshReflectorMaterial } from '@react-three/drei';

export default function Mirror() {
  return (
    <group position={[0, 0.85, -2.3]}>
      <mesh>
        <circleGeometry args={[1.3, 48]} />
        <MeshReflectorMaterial
          blur={[120, 40]}
          resolution={512}
          mixBlur={0.3}
          mixStrength={25}
          roughness={0.15}
          depthScale={1}
          minDepthThreshold={0.85}
          color="#050505"
          metalness={0.85}
        />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[1.3, 1.37, 64]} />
        <meshStandardMaterial color="#e8e6e0" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}
