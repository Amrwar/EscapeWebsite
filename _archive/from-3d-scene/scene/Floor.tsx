import { MeshReflectorMaterial } from '@react-three/drei';

export default function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]}>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        blur={[250, 90]}
        resolution={512}
        mixBlur={1}
        mixStrength={12}
        roughness={0.9}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#040404"
        metalness={0.35}
      />
    </mesh>
  );
}
