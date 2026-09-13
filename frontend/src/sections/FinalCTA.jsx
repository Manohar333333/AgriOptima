import { ArrowRight } from "lucide-react";
import Button from "../components/Button";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./FinalCTA.css";

export default function FinalCTA() {
  const revealRef = useScrollReveal();

  return (
    <section className="section final-cta" ref={revealRef}>
      <div className="container final-cta__inner" data-reveal>
        <h2 className="final-cta__title">
          Your next planting decision doesn't have to be a guess.
        </h2>
        <Button variant="primary" as="a" href="#farm-analysis" icon={ArrowRight}>
          Analyze Your Farm
        </Button>
      </div>
    </section>
  );
}
