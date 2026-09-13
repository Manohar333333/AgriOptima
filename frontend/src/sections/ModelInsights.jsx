import { BrainCircuit, Database, ListChecks } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import StatCard from "../components/StatCard";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./ModelInsights.css";

const CONSIDERED = [
  "Soil type and pH",
  "Nitrogen, phosphorus, potassium",
  "Temperature, humidity, rainfall",
  "Soil moisture and farm area",
  "Water availability and irrigation type",
];

export default function ModelInsights() {
  const revealRef = useScrollReveal();

  return (
    <section id="model-insights" className="section model-insights">
      <div className="container" ref={revealRef}>
        <SectionHeading
          tag="AI insights"
          title="What's happening behind the recommendation"
          subtitle="AgriOptima's crop model is trained to recognize patterns across thousands of soil and climate combinations, not to apply a fixed rulebook."
        />

        <div className="model-insights__grid">
          <div className="model-insights__stats" data-reveal>
            <StatCard icon={BrainCircuit} label="Model accuracy" value={96.5} decimals={1} suffix="%" tone="good" helper="Measured on held-out validation data." />
            <StatCard icon={Database} label="Crops covered" value={8} helper="Cotton, Groundnut, Maize, Millet, Rice, Sugarcane, Tomato, Wheat." />
          </div>

          <div className="model-insights__considers surface-interactive" data-reveal>
            <div className="model-insights__considers-head">
              <ListChecks size={20} strokeWidth={1.8} aria-hidden="true" />
              <h3>What the model considers</h3>
            </div>
            <ul>
              {CONSIDERED.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
