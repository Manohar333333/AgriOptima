import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";
import { EASE_OUT, DURATION, REVEAL_OFFSET_Y, REVEAL_BLUR_PX } from "../utils/motion";

gsap.registerPlugin(ScrollTrigger);

// Starting offsets for each contextual origin. Kept small and restrained —
// this is a shift in focus, not a slide-in animation.
const FROM_STATE = {
  up: { y: REVEAL_OFFSET_Y, x: 0, scale: 1 },
  left: { y: 0, x: -16, scale: 1 },
  right: { y: 0, x: 16, scale: 1 },
  scale: { y: 8, x: 0, scale: 0.97 },
};

/**
 * Applies one shared reveal system to the children matching `selector`
 * inside the returned ref — but the *origin* of the movement is chosen per
 * call to match where that content logically belongs, rather than every
 * section using the same blanket "rise from below":
 *
 *  - "up"    default: a small settle upward. For content with no strong
 *            spatial relationship to what's around it.
 *  - "left"  for sequences read along their own axis (e.g. numbered
 *            steps) — they unfold along that axis instead of rising.
 *  - "scale" for content that "surfaces" from a container above it (e.g.
 *            dashboard results emerging from the form that produced them).
 *
 * @param {string} selector - descendant elements to reveal, default [data-reveal]
 * @param {{ from?: 'up'|'left'|'right'|'scale', blur?: boolean, stagger?: number }} config
 */
export function useScrollReveal(selector = "[data-reveal]", config = {}) {
  const { from = "up", blur = true, stagger = 0.09, ...gsapOverrides } = config;
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const targets = containerRef.current.querySelectorAll(selector);
    if (!targets.length) return;

    const offset = FROM_STATE[from] ?? FROM_STATE.up;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: offset.y,
          x: offset.x,
          scale: offset.scale,
          ...(blur ? { filter: `blur(${REVEAL_BLUR_PX}px)` } : {}),
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          ...(blur ? { filter: "blur(0px)" } : {}),
          duration: DURATION.slow,
          ease: EASE_OUT,
          stagger,
          ...(blur ? { clearProps: "filter" } : {}),
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
          ...gsapOverrides,
        }
      );
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, from, blur, stagger, reducedMotion]);

  return containerRef;
}
