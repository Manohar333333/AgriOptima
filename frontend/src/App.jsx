import { useEffect, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./components/Navbar";
import IntroSplash from "./components/IntroSplash";
import AmbientField from "./components/AmbientField";
import Hero from "./sections/Hero";
import WhyAgriOptima from "./sections/WhyAgriOptima";
import HowItWorks from "./sections/HowItWorks";
import FarmAnalysisForm from "./sections/FarmAnalysisForm";
import ResultsDashboard from "./sections/dashboard/ResultsDashboard";
import ModelInsights from "./sections/ModelInsights";
import FinalCTA from "./sections/FinalCTA";
import Footer from "./sections/Footer";
import { useFarmAnalysis } from "./hooks/useFarmAnalysis";
import { resetScrollToTop } from "./utils/scrollTop";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const farmAnalysis = useFarmAnalysis();
  // Two-phase intro handoff: `revealed` flips as the splash's brand mark
  // starts expanding away (so the Hero's own entrance overlaps it rather
  // than waiting for it to finish), `introMounted` stays true until the
  // splash overlay has fully faded and can be unmounted.
  const [revealed, setRevealed] = useState(false);
  const [introMounted, setIntroMounted] = useState(true);

  // Belt-and-suspenders on top of main.jsx's pre-render reset: closes the
  // gap for any restoration that lands between that script running and
  // React's first paint. `resetScrollToTop` uses behavior: "instant" so
  // this can never itself produce a visible jump.
  useLayoutEffect(() => {
    resetScrollToTop();
  }, []);

  // Lock scroll on both the root element and body while the splash is
  // present — some engines resolve the page's scrolling element to
  // <html> rather than <body>, so locking only one is not reliable
  // across browsers. This also passively neutralizes any scroll offset a
  // browser tries to apply during the locked window, since there's
  // nothing to scroll while it's active.
  useEffect(() => {
    const lock = introMounted;
    document.documentElement.style.overflow = lock ? "hidden" : "";
    document.body.style.overflow = lock ? "hidden" : "";
    if (!lock) {
      // The moment scrolling unlocks is a real state transition, not a
      // guess — a good point to snap to top in case a restoration
      // attempt was queued (but not visually applied) during the lock.
      resetScrollToTop();
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [introMounted]);

  // The display fonts (Fraunces/Inter) load asynchronously and can shift
  // text height after ScrollTriggers have already cached their start/end
  // positions from the fallback font's metrics. A single refresh once
  // fonts are actually ready re-measures everything correctly — this is
  // standard GSAP practice for async-loaded fonts, not a workaround.
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready?.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <AmbientField />
      {introMounted && (
        <IntroSplash
          onExitStart={() => setRevealed(true)}
          onComplete={() => setIntroMounted(false)}
        />
      )}
      <div className="page" aria-hidden={!revealed}>
        <Navbar />
        <main>
          <Hero revealed={revealed} />
          <WhyAgriOptima />
          <HowItWorks />
          <FarmAnalysisForm farmAnalysis={farmAnalysis} />
          <ResultsDashboard result={farmAnalysis.result} status={farmAnalysis.status} />
          <ModelInsights />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
