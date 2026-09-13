export default function SoilLayers({ moisturePct = 60 }) {
  const layers = [
    { color: "#3a2a1c", label: "topsoil" },
    { color: "#4a3624", label: "subsoil" },
    { color: "#5c4530", label: "substratum" },
  ];
  const wetHeight = Math.max(0.15, Math.min(1, moisturePct / 100));

  return (
    <group position={[0, -0.5, 0]}>
      {layers.map((layer, i) => (
        <mesh key={layer.label} position={[0, -i * 0.9, 0]}>
          <boxGeometry args={[3, 0.85, 3]} />
          <meshStandardMaterial color={layer.color} roughness={1} />
        </mesh>
      ))}
      {/* moisture indicator slab overlaid on the topsoil */}
      <mesh position={[0, 0.43 - (1 - wetHeight) * 0.4, 1.51]}>
        <planeGeometry args={[3, 0.85 * wetHeight]} />
        <meshStandardMaterial color="#6fa8c0" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}
