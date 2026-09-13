import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WaterParticles({ count = 90, spread = 12, color = "#6fa8c0" }) {
  const pointsRef = useRef();

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = Math.random() * 6 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      speeds[i] = 0.2 + Math.random() * 0.35;
    }
    return { positions, speeds };
  }, [count, spread]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const attr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + speeds[i] * delta;
      if (y > 4) y = -2;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.045}
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}
