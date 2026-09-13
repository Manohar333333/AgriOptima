import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";

// Animates a number from 0 (or its previous value) to `target` whenever
// `target` changes and the element holding the ref becomes visible.
export function useCountUp(target, { decimals = 0, duration = 1.2 } = {}) {
  const [display, setDisplay] = useState(0);
  const elRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const proxy = useRef({ value: 0 });

  useEffect(() => {
    if (target === null || target === undefined || Number.isNaN(target)) return;

    if (reducedMotion) {
      setDisplay(target);
      return;
    }

    const node = elRef.current;
    let tween;

    const animate = () => {
      tween = gsap.to(proxy.current, {
        value: target,
        duration,
        ease: "power2.out",
        onUpdate: () => setDisplay(proxy.current.value),
      });
    };

    if (node && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            animate();
            observer.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      observer.observe(node);
      return () => {
        observer.disconnect();
        tween?.kill();
      };
    }

    animate();
    return () => tween?.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reducedMotion]);

  const rounded =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString();

  return { ref: elRef, value: rounded };
}
