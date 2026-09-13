import SectionHeading from "../../components/SectionHeading";
import CropRecommendation from "./CropRecommendation";
import WaterOptimization from "./WaterOptimization";
import IrrigationIntelligence from "./IrrigationIntelligence";
import AlternativeCrops from "./AlternativeCrops";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import "./ResultsDashboard.css";

export default function ResultsDashboard({ result, status }) {
  const revealRef = useScrollReveal("[data-reveal]", { from: "scale", blur: false, stagger: 0.12 });

  const hasResult = status === "success" && result;

  return (
    <section id="results" className="section results">
      <div className="container" ref={revealRef}>
        <SectionHeading
          tag="Farm analysis results"
          title={hasResult ? "Your farm's recommendation" : "Your results will appear here"}
          subtitle={
            hasResult
              ? "Based on the conditions you entered above."
              : "Fill in the farm analysis form and submit it to see your crop recommendation, water plan and irrigation guidance."
          }
        />

        {hasResult ? (
          <div className="results__stack">
            <CropRecommendation crop={result.crop} />

            <div className="results__panel">
              <h3 className="results__panel-title">Water optimization</h3>
              <WaterOptimization water={result.water} />
            </div>

            <div className="results__panel">
              <h3 className="results__panel-title">Irrigation intelligence</h3>
              <IrrigationIntelligence irrigation={result.irrigation} />
            </div>

            <div className="results__panel">
              <h3 className="results__panel-title">Water-efficient alternatives</h3>
              <AlternativeCrops alternatives={result.alternatives} />
            </div>
          </div>
        ) : (
          <div className="results__empty" data-reveal>
            <p>No analysis yet — this section fills in automatically after you submit the form.</p>
          </div>
        )}
      </div>
    </section>
  );
}
