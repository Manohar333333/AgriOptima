import SectionHeading from "../components/SectionHeading";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./HowItWorks.css";

const STEPS = [
  {
    n: "01",
    title: "Enter your farm details",
    body: "Soil type, season, nutrients, weather and how much water you have on hand.",
  },
  {
    n: "02",
    title: "The model reads your soil",
    body: "A Random Forest model trained on agricultural data scores each crop against your conditions.",
  },
  {
    n: "03",
    title: "Water gets planned around it",
    body: "The optimizer weighs your recommended crop's needs against your actual water availability.",
  },
  {
    n: "04",
    title: "You get a plan, not just a prediction",
    body: "A ranked crop, a water plan, and an irrigation priority you can act on today.",
  },
];

export default function HowItWorks() {
  const revealRef = useScrollReveal("[data-reveal]", { from: "left", blur: false, stagger: 0.1 });

  return (
    <section id="how-it-works" className="section how">
      <div className="container" ref={revealRef}>
        <SectionHeading
          tag="How it works"
          title="From soil test to irrigation plan in one pass"
        />
        <ol className="how__steps">
          {STEPS.map((step) => (
            <li className="how__step" key={step.n} data-reveal>
              <span className="how__step-number">{step.n}</span>
              <div>
                <h3 className="how__step-title">{step.title}</h3>
                <p className="how__step-body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
