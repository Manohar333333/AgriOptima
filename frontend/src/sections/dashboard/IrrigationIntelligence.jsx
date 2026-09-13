import { AlertCircle, Droplets, Sprout } from "lucide-react";
import "./IrrigationIntelligence.css";

const PRIORITY_TONE = {
  Low: "good",
  Medium: "warn",
  High: "critical",
};

export default function IrrigationIntelligence({ irrigation }) {
  const tone = PRIORITY_TONE[irrigation.priority] ?? "neutral";

  return (
    <div className="irrigation" data-reveal>
      <div className="irrigation__priority">
        <AlertCircle size={20} strokeWidth={1.8} aria-hidden="true" />
        <div>
          <span className="field__label">Irrigation priority</span>
          <p className={`irrigation__priority-value irrigation__priority-value--${tone}`}>
            {irrigation.priority}
          </p>
        </div>
      </div>

      <div className="irrigation__cards">
        <div className="irrigation__card surface-interactive">
          <Droplets size={20} strokeWidth={1.7} aria-hidden="true" />
          <h4>Recommendation</h4>
          <p>{irrigation.recommendation}</p>
        </div>
        <div className="irrigation__card surface-interactive">
          <Sprout size={20} strokeWidth={1.7} aria-hidden="true" />
          <h4>Soil moisture advice</h4>
          <p>{irrigation.soilMoistureAdvice}</p>
        </div>
        <div className="irrigation__card surface-interactive">
          <Droplets size={20} strokeWidth={1.7} aria-hidden="true" />
          <h4>Irrigation method</h4>
          <p>{irrigation.methodAdvice}</p>
        </div>
      </div>
    </div>
  );
}
