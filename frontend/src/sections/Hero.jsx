import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Button from "../components/Button";
import GlassPanel from "../components/GlassPanel";
import AgriculturalScene from "../three/AgriculturalScene";
import SceneErrorBoundary from "../components/SceneErrorBoundary";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { EASE_OUT } from "../utils/motion";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ revealed = true }) {
  const rootRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const hasPlayedRef = useRef(false);

  // Entrance timeline — held back until `revealed` flips true, so it can
  // be timed to overlap the intro splash's exit rather than starting cold
  // the instant this component mounts underneath it.
  useEffect(() => {
    if (!revealed || hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    if (reducedMotion) {
      gsap.set(
        [".hero__eyebrow", ".hero__title-line", ".hero__copy", ".hero__ctas", ".hero__canvas", ".hero__readout"],
        { opacity: 1, y: 0, scale: 1 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: EASE_OUT } })
        .fromTo(".hero__canvas", { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 1.6 })
        .fromTo(".hero__eyebrow", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55 }, "-=1.1")
        .fromTo(
          ".hero__title-line",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
          "-=0.3"
        )
        .fromTo(".hero__copy", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.65 }, "-=0.5")
        .fromTo(".hero__ctas", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.65 }, "-=0.55")
        .fromTo(
          ".hero__readout",
          { opacity: 0, y: 10, scale: 0.985 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65 },
          "-=0.55"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [revealed, reducedMotion]);

  // Subtle scroll parallax on the 3D layer as the visitor scrolls past the
  // hero — a small, scrubbed transform tied to native scroll position.
  // This never intercepts or overrides scrolling itself.
  useEffect(() => {
    if (reducedMotion || !canvasWrapRef.current || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(canvasWrapRef.current, {
        yPercent: 8,
        scale: 1.05,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="top" className="hero" ref={rootRef}>
      <div className="hero__canvas" ref={canvasWrapRef} aria-hidden="true">
        <SceneErrorBoundary fallback={<div className="hero__canvas-fallback" />}>
          <AgriculturalScene reducedMotion={reducedMotion} />
        </SceneErrorBoundary>
      </div>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="container hero__grid">
        <div className="hero__copy-block">
          <span className="hero__eyebrow section-tag">AgriOptima</span>
          <h1 className="hero__title">
            <span className="hero__title-line">Smarter Farming.</span>
            <span className="hero__title-line">Better Decisions.</span>
          </h1>
          <p className="hero__copy">
            AgriOptima brings together crop intelligence, water optimization
            and irrigation guidance in one place, so you can decide what to
            plant and how to water it with real data behind you.
          </p>
          <div className="hero__ctas">
            <Button variant="primary" as="a" href="#farm-analysis" icon={ArrowRight}>
              Analyze Your Farm
            </Button>
            <Button variant="secondary" as="a" href="#why">
              Explore AgriOptima
            </Button>
          </div>
        </div>

        <GlassPanel className="hero__readout surface-interactive" aria-hidden="true">
          <div className="hero__readout-row">
            <span>Recommended crop</span>
            <strong>Maize</strong>
          </div>
          <hr className="hairline" />
          <div className="hero__readout-row">
            <span>Water sufficiency</span>
            <strong>84.6%</strong>
          </div>
          <div className="hero__readout-row">
            <span>Status</span>
            <strong className="hero__readout-status">Moderate</strong>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
