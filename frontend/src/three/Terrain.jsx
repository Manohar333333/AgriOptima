import { useMemo } from "react";
import * as THREE from "three";

// Simple deterministic pseudo-noise so the terrain is reproducible without
// pulling in a noise library.
function pseudoNoise(x, y) {
  return (
    Math.sin(x * 1.3 + y * 0.7) * 0.5 +
    Math.sin(x * 0.6 - y * 1.1) * 0.3 +
    Math.sin((x + y) * 0.35) * 0.2
  );
}

export default function Terrain({
  size = 40,
  segments = 60,
  height = 1.4,
  color = "#1f3d2b",
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pseudoNoise(x * 0.25, y * 0.25) * height;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [size, segments, height]);

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.6, 0]}
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={0.95} metalness={0} />
    </mesh>
  );
}
