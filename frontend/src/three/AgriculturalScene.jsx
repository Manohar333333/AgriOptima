import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Terrain from "./Terrain";
import CropField from "./CropField";
import WaterParticles from "./WaterParticles";
import FloatingData from "./FloatingData";

// Wraps the scene contents so the environment responds to the visitor
// rather than sitting inert behind the interface: a tiny, inertia-damped
// rotation toward the pointer, plus a slow independent camera drift for
// atmosphere. Both are intentionally small — this should read as a living
// place, not a demo showing off parallax.
function SceneRig({ reducedMotion }) {
  const groupRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { camera } = useThree();
  const basePosition = useRef(camera.position.clone());
  // A small fixed compositional tilt — the field is framed slightly
  // off-axis rather than dead-center, which reads as a deliberate shot
  // rather than a straight-on product-demo angle. Pointer parallax then
  // moves a few degrees around this base, never returning to zero.
  const baseTiltY = 0.1;

  useEffect(() => {
    if (reducedMotion) return;
    const handleMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reducedMotion]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (reducedMotion) {
      groupRef.current.rotation.y = baseTiltY;
      return;
    }
    const t = state.clock.getElapsedTime();

    // Pointer parallax, lerped with heavy damping rather than snapped —
    // this should feel like it has mass, settling toward the cursor
    // rather than tracking it.
    const targetRotY = baseTiltY + pointer.current.x * 0.032;
    const targetRotX = pointer.current.y * -0.014;
    const damp = 1 - Math.pow(0.0006, delta);
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * damp;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * damp;

    // Slow, independent camera drift — an atmospheric breathing motion,
    // not a reaction to anything the visitor does. Deliberately tiny.
    camera.position.x = basePosition.current.x + Math.sin(t * 0.07) * 0.1;
    camera.position.y = basePosition.current.y + Math.sin(t * 0.1) * 0.055;
    camera.lookAt(0, 0.15, 0);
  });

  return (
    <group ref={groupRef} rotation={[0, baseTiltY, 0]}>
      <Terrain />
      <CropField />
      <WaterParticles />
      <FloatingData />
    </group>
  );
}

// Handles a lost/restored WebGL context explicitly. Chromium browsers can
// reclaim a GPU context under memory pressure or a driver reset; calling
// preventDefault() on the loss event is what tells the browser we intend
// to handle recovery ourselves, which is also what allows it to fire
// `webglcontextrestored` afterward instead of leaving the canvas dead.
function handleCanvasCreated({ gl }) {
  const canvasEl = gl.domElement;
  const onLost = (event) => {
    event.preventDefault();
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("[AgriculturalScene] WebGL context lost — awaiting restoration.");
    }
  };
  const onRestored = () => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info("[AgriculturalScene] WebGL context restored.");
    }
  };
  canvasEl.addEventListener("webglcontextlost", onLost, false);
  canvasEl.addEventListener("webglcontextrestored", onRestored, false);
}

export default function AgriculturalScene({ reducedMotion = false }) {
  return (
    <Canvas
      camera={{ position: [6, 3.2, 8], fov: 42 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={handleCanvasCreated}
    >
      <color attach="background" args={["#0e1a13"]} />
      <fog attach="fog" args={["#0e1a13", 9, 29]} />
      {/*
        No <Environment> preset here — drei's environment presets fetch an
        HDR file from an external CDN at runtime. That's an unnecessary
        network dependency for a subtle reflection on already-matte,
        low-metalness materials, and a failed/blocked fetch (ad blockers,
        Edge's tracking prevention, a flaky connection) was the most likely
        source of this scene occasionally crashing the whole app. The
        lighting rig below is tuned to cover for its absence.
      */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 3]} intensity={1.1} color="#f4f1e6" />
      <pointLight position={[-4, 2, -3]} intensity={0.36} color="#6fa8c0" />
      <pointLight position={[3, 1.5, 4]} intensity={0.18} color="#d9a441" />

      <SceneRig reducedMotion={reducedMotion} />
    </Canvas>
  );
}
