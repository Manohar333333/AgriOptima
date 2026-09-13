import { cropColor } from "../../data/cropOptions";
import { formatPercent } from "../../utils/formatters";
import "./CropRecommendation.css";

// Hides negligible probabilities so the chart stays legible.
const MIN_VISIBLE_PROBABILITY = 0.03;

export default function CropRecommendation({ crop }) {
  const visible = crop.probabilities.filter((p) => p.probability >= MIN_VISIBLE_PROBABILITY);

  return (
    <div className="crop-rec" data-reveal>
      <div className="crop-rec__headline">
        <span className="field__label">Recommended crop</span>
        <h3 className="crop-rec__name">{crop.recommended}</h3>
        <p className="crop-rec__confidence">
          {formatPercent(crop.confidence * 100, 1)} prediction confidence
        </p>
      </div>

      <div className="crop-rec__bars">
        {visible.map((p) => (
          <div className="crop-rec__bar-row" key={p.crop}>
            <span className="crop-rec__bar-label">{p.crop}</span>
            <div className="crop-rec__bar-track">
              <div
                className="crop-rec__bar-fill"
                style={{
                  width: `${p.probability * 100}%`,
                  background: cropColor(p.crop),
                }}
              />
            </div>
            <span className="crop-rec__bar-value">{formatPercent(p.probability * 100, 1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
