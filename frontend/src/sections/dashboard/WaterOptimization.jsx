import { Droplet, Gauge, TrendingDown, AlertTriangle } from "lucide-react";
import StatCard from "../../components/StatCard";
import ProgressRing from "../../components/ProgressRing";
import { statusTone } from "../../utils/formatters";
import "./WaterOptimization.css";

export default function WaterOptimization({ water }) {
  const tone = statusTone(water.status);
  const advice = water.irrigationAdvice || water.irrigation_advice;
  const requirementMm = water.requirementMm ?? water.water_requirement_mm;
  const farmAreaHa = water.farmAreaHa ?? water.farm_area_ha;

  return (
    <div className="water-opt" data-reveal>
      <div className="water-opt__overview">
        <div className="water-opt__ring">
          <ProgressRing percent={water.sufficiencyPct} tone={tone} label="Water sufficiency" />
          <span className={`water-opt__status water-opt__status--${tone}`}>
            {water.status}
          </span>
          {(requirementMm != null || farmAreaHa != null) && (
            <div className="water-opt__details">
              {requirementMm != null && (
                <div className="water-opt__detail-row">
                  <span className="water-opt__detail-label">Crop water requirement</span>
                  <span className="water-opt__detail-value">{requirementMm} mm</span>
                </div>
              )}
              {farmAreaHa != null && (
                <div className="water-opt__detail-row">
                  <span className="water-opt__detail-label">Farm area</span>
                  <span className="water-opt__detail-value">{farmAreaHa} ha</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="water-opt__stats">
          <StatCard
            icon={Droplet}
            label="Theoretical requirement"
            value={water.theoreticalRequirementL}
            suffix=" L"
            helper={requirementMm != null && farmAreaHa != null ? `${requirementMm} mm across ${farmAreaHa} ha` : undefined}
          />
          <StatCard icon={Gauge} label="Optimized requirement" value={water.optimizedRequirementL} suffix=" L" tone="good" />
          <StatCard icon={Droplet} label="Available water" value={water.availableWaterL} suffix=" L" />
          <StatCard icon={Droplet} label="Water used" value={water.waterUsedL} suffix=" L" />
          <StatCard icon={TrendingDown} label="Potential savings" value={water.potentialSavingsL} suffix=" L" tone="good" />
          <StatCard icon={AlertTriangle} label="Water deficit" value={water.deficitL} suffix=" L" tone={water.deficitL > 0 ? "warn" : "neutral"} />
        </div>
      </div>

      {advice && (
        <div className={`water-opt__advice water-opt__advice--${tone} surface-interactive`}>
          <div className="water-opt__advice-icon-wrapper">
            {tone === "critical" ? (
              <AlertTriangle size={20} strokeWidth={2} className="water-opt__advice-icon" aria-hidden="true" />
            ) : (
              <Droplet size={20} strokeWidth={2} className="water-opt__advice-icon" aria-hidden="true" />
            )}
          </div>
          <div className="water-opt__advice-content">
            <span className="water-opt__advice-title">Water Plan Advice</span>
            <p className="water-opt__advice-text">{advice}</p>
          </div>
        </div>
      )}
    </div>
  );
}
