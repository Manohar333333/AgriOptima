import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { Sprout } from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { EASE_OUT, EASE_IN_OUT } from "../utils/motion";
import "./IntroSplash.css";

const PARTICLE_COUNT = 16;

// Two callbacks, not one: `onExitStart` fires the moment the brand mark
// begins expanding away (this is when the homepage underneath should
// start its own entrance), and `onComplete` fires once the overlay has
// fully cleared (this is when scroll should unlock and the overlay can
// unmount). The overlap between them is what makes the handoff read as
// "brand mark → spatial expansion → website" instead of a hard cut.
export default function IntroSplash({ onExitStart, onComplete }) {
  const rootRef = useRef(null);
  const contentRef = useRef(null);
  const glowRef = useRef(null);
  const markRef = useRef(null);
  const wordmarkRef = useRef(null);
  const taglineRef = useRef(null);
  const exitStartedRef = useRef(false);
  const finishedRef = useRef(false);
  const reducedMotion = useReducedMotion();

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, () => ({
        left: Math.random() * 100,
        top: 55 + Math.random() * 40,
        size: 2 + Math.random() * 3,
        duration: 4 + Math.random() * 3,
        delay: Math.random() * 4,
      })),
    []
  );

  useEffect(() => {
    const startExit = () => {
      if (exitStartedRef.current) return;
      exitStartedRef.current = true;
      onExitStart?.();
    };
    const finish = () => {
      startExit();
      if (finishedRef.current) return;
      finishedRef.current = true;
      onComplete?.();
    };

    let tl;

    if (reducedMotion) {
      tl = gsap.timeline({ onComplete: finish });
      tl.set(rootRef.current, { opacity: 1 });
      tl.set(markRef.current, { opacity: 1, scale: 1 });
      tl.set(wordmarkRef.current, { opacity: 1, y: 0 });
      tl.set(taglineRef.current, { opacity: 1, y: 0 });
      tl.call(startExit);
      tl.to(rootRef.current, { opacity: 0, duration: 0.4, delay: 0.2 });
    } else {
      tl = gsap.timeline({ onComplete: finish });
      tl.set(rootRef.current, { opacity: 1 });
      tl.fromTo(
        markRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.7, ease: EASE_OUT }
      );
      tl.to(glowRef.current, { opacity: 1, duration: 0.9, ease: "power2.out" }, "<");
      tl.fromTo(
        wordmarkRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
        "-=0.25"
      );
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );
      tl.to({}, { duration: 0.6 }); // brief hold on the branding

      // Exit begins here: the homepage starts its own entrance under
      // cover of the still-visible overlay, so by the time the overlay
      // is gone the page is already mid-motion rather than starting cold.
      tl.call(startExit);
      tl.to(contentRef.current, { opacity: 0, duration: 0.5, ease: EASE_IN_OUT }, "<");
      // The mark's glow expands outward to fill the frame — the "spatial
      // expansion" beat — while the dark overlay itself fades away
      // underneath it, revealing the homepage already in motion.
      tl.to(
        glowRef.current,
        { scale: 16, opacity: 0, duration: 1.1, ease: EASE_IN_OUT },
        "<"
      );
      tl.to(rootRef.current, { opacity: 0, duration: 0.7, ease: EASE_IN_OUT }, "-=0.85");
    }

    // Allow an impatient visitor to skip with a click or keypress.
    const skip = () => {
      tl.progress(1);
    };
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });

    return () => {
      tl.kill();
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <div className="intro-splash" ref={rootRef} role="presentation" aria-hidden="true">
      {!reducedMotion && (
        <div className="intro-splash__particles">
          {particles.map((p, i) => (
            <span
              key={i}
              className="intro-splash__particle"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="intro-splash__content" ref={contentRef}>
        <div className="intro-splash__mark-wrap">
          <div className="intro-splash__glow" ref={glowRef} />
          <div className="intro-splash__mark" ref={markRef}>
            <Sprout size={34} strokeWidth={1.6} aria-hidden="true" />
          </div>
        </div>
        <h1 className="intro-splash__wordmark" ref={wordmarkRef}>
          AGRI OPTIMA
        </h1>
        <p className="intro-splash__tagline" ref={taglineRef}>
          Intelligent Agriculture. Optimized Resources.
        </p>
      </div>
    </div>
  );
}
