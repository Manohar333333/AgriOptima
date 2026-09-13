import { cropColor } from "../../data/cropOptions";
import "./AlternativeCrops.css";

export default function AlternativeCrops({ alternatives }) {
  return (
    <div className="alt-crops" data-reveal>
      <span className="field__label">Water-efficient alternatives</span>
      <div className="alt-crops__list">
        {alternatives.map((crop) => (
          <span className="alt-crops__chip surface-interactive" key={crop}>
            <span className="alt-crops__dot" style={{ background: cropColor(crop) }} />
            {crop}
          </span>
        ))}
      </div>
    </div>
  );
}
