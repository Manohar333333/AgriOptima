import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const dummy = new THREE.Object3D();

export default function CropField({
  rows = 10,
  cols = 14,
  spacing = 0.55,
  color = "#86c08a",
}) {
  const meshRef = useRef();
  const count = rows * cols;

  const seeds = useMemo(() => {
    const arr = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        arr.push({
          x: (j - cols / 2) * spacing + (Math.random() - 0.5) * 0.15,
          z: (i - rows / 2) * spacing + (Math.random() - 0.5) * 0.15,
          height: 0.7 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    return arr;
  }, [rows, cols, spacing]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    seeds.forEach((seed, i) => {
      const sway = Math.sin(t * 1.1 + seed.phase) * 0.08;
      dummy.position.set(seed.x, -1.6 + seed.height / 2, seed.z);
      dummy.rotation.set(0, seed.phase, sway);
      dummy.scale.set(1, seed.height, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} castShadow>
      <coneGeometry args={[0.09, 1, 6]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </instancedMesh>
  );
}
