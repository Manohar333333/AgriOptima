import { cropColor } from "../../data/cropOptions";
import { formatLitres, formatNumber, formatPercent, statusTone } from "../../utils/formatters";
import "./AlternativeCrops.css";

export default function AlternativeCrops({ alternatives = [] }) {
  if (!alternatives || alternatives.length === 0) return null;

  const hasDetailedMetrics = alternatives.some(
    (alt) =>
      typeof alt === "object" &&
      (alt.waterRequirementMm != null ||
        alt.water_requirement_mm != null ||
        alt.optimizedWaterL != null ||
        alt.waterSufficiencyPct != null)
  );

  return (
    <div className="alt-crops" data-reveal>
      {hasDetailedMetrics ? (
        <div className="alt-crops__grid">
          {alternatives.map((alt) => {
            const cropName = typeof alt === "string" ? alt : (alt.crop || alt.Crop);
            const reqMm = alt.waterRequirementMm ?? alt.water_requirement_mm ?? alt.Water_Requirement_mm;
            const optL = alt.optimizedWaterL ?? alt.optimized_water_liters ?? alt.Optimized_Water_Liters;
            const suffPct = alt.waterSufficiencyPct ?? alt.water_sufficiency_percent ?? alt["Water_Sufficiency_%"];
            const status = alt.waterStatus ?? alt.water_status ?? alt.Water_Status;
            const deficitL = alt.waterDeficitL ?? alt.water_deficit_liters ?? alt.Water_Deficit_Liters;
            const tone = statusTone(status);

            return (
              <div className="alt-crop-card surface-interactive" key={cropName}>
                <div className="alt-crop-card__head">
                  <div className="alt-crop-card__crop">
                    <span className="alt-crop-card__dot" style={{ background: cropColor(cropName) }} />
                    <span className="alt-crop-card__name">{cropName}</span>
                  </div>
                  {status && (
                    <span className={`alt-crop-card__badge alt-crop-card__badge--${tone}`}>
                      {status}
                    </span>
                  )}
                </div>

                <div className="alt-crop-card__details">
                  {reqMm != null && (
                    <div className="alt-crop-card__row">
                      <span className="alt-crop-card__label">Water need</span>
                      <span className="alt-crop-card__value">{formatNumber(reqMm, 1)} mm</span>
                    </div>
                  )}
                  {optL != null && (
                    <div className="alt-crop-card__row">
                      <span className="alt-crop-card__label">Optimized vol.</span>
                      <span className="alt-crop-card__value">{formatLitres(optL)}</span>
                    </div>
                  )}
                  {suffPct != null && (
                    <div className="alt-crop-card__row">
                      <span className="alt-crop-card__label">Sufficiency</span>
                      <span className={`alt-crop-card__value alt-crop-card__value--${tone}`}>
                        {formatPercent(suffPct, 1)}
                      </span>
                    </div>
                  )}
                  {deficitL != null && deficitL > 0 && (
                    <div className="alt-crop-card__row">
                      <span className="alt-crop-card__label">Deficit</span>
                      <span className="alt-crop-card__value alt-crop-card__value--critical">
                        {formatLitres(deficitL)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="alt-crops__chips">
          {alternatives.map((crop) => (
            <span className="alt-crops__chip surface-interactive" key={crop}>
              <span className="alt-crops__dot" style={{ background: cropColor(crop) }} />
              {crop}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
