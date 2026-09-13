import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";
import "./AmbientField.css";

gsap.registerPlugin(ScrollTrigger);

// One fixed, page-spanning gradient layer sitting behind every section
// (opaque cards and panels paint over it; the space around them doesn't).
// A single ScrollTrigger scrubs its position across the *entire* document,
// not per-section — this is what threads the sections into one continuous
// environment rather than each one running its own isolated reveal.
export default function AmbientField() {
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(rootRef.current, {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return <div className="ambient-field" ref={rootRef} aria-hidden="true" />;
}
