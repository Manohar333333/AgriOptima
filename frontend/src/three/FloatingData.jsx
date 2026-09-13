import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const dummy = new THREE.Object3D();

export default function FloatingData({ count = 6, radius = 5.5, color = "#d9a441" }) {
  const meshRef = useRef();

  const nodes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * Math.PI * 2,
        r: radius * (0.6 + Math.random() * 0.4),
        yBase: 0.5 + Math.random() * 1.8,
        speed: 0.15 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
      })),
    [count, radius]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    nodes.forEach((n, i) => {
      const angle = n.angle + t * n.speed;
      const x = Math.cos(angle) * n.r;
      const z = Math.sin(angle) * n.r;
      const y = n.yBase + Math.sin(t * 0.8 + n.phase) * 0.2;
      dummy.position.set(x, y, z);
      dummy.rotation.set(t * 0.3, t * 0.3, 0);
      dummy.scale.setScalar(0.09);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        roughness={0.3}
      />
    </instancedMesh>
  );
}
