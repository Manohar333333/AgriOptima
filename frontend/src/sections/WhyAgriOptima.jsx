import { Sprout, Droplets, Gauge } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./WhyAgriOptima.css";

const PILLARS = [
  {
    icon: Sprout,
    title: "Crop intelligence",
    body: "A model trained on soil, season and climate data recommends the crop most likely to thrive on your specific plot, ranked by confidence rather than a guess.",
  },
  {
    icon: Droplets,
    title: "Water optimization",
    body: "See exactly how much water your recommended crop needs against what you actually have, so you plan around a real number instead of a rule of thumb.",
  },
  {
    icon: Gauge,
    title: "Irrigation guidance",
    body: "Get a priority level and a plain-language plan for when to irrigate, which method suits your farm, and what your soil moisture is telling you.",
  },
];

export default function WhyAgriOptima() {
  const revealRef = useScrollReveal();

  return (
    <section id="why" className="section why" ref={revealRef}>
      <div className="container">
        <SectionHeading
          tag="Why AgriOptima"
          title="Three decisions, made with data instead of guesswork"
          subtitle="Most farm decisions are made with experience and instinct alone. AgriOptima adds a data-backed second opinion to what you already know."
        />
        <div className="why__grid">
          {PILLARS.map((pillar) => (
            <div className="why__card surface-interactive" key={pillar.title} data-reveal>
              <pillar.icon className="why__card-icon" size={26} strokeWidth={1.6} aria-hidden="true" />
              <h3 className="why__card-title">{pillar.title}</h3>
              <p className="why__card-body">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
