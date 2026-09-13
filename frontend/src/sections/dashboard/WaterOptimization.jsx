import { Droplet, Gauge, TrendingDown, AlertTriangle } from "lucide-react";
import StatCard from "../../components/StatCard";
import ProgressRing from "../../components/ProgressRing";
import { statusTone } from "../../utils/formatters";
import "./WaterOptimization.css";

export default function WaterOptimization({ water }) {
  const tone = statusTone(water.status);

  return (
    <div className="water-opt" data-reveal>
      <div className="water-opt__ring">
        <ProgressRing percent={water.sufficiencyPct} tone={tone} label="Water sufficiency" />
        <span className={`water-opt__status water-opt__status--${tone}`}>
          {water.status}
        </span>
      </div>

      <div className="water-opt__stats">
        <StatCard icon={Droplet} label="Theoretical requirement" value={water.theoreticalRequirementL} suffix=" L" />
        <StatCard icon={Gauge} label="Optimized requirement" value={water.optimizedRequirementL} suffix=" L" tone="good" />
        <StatCard icon={Droplet} label="Available water" value={water.availableWaterL} suffix=" L" />
        <StatCard icon={Droplet} label="Water used" value={water.waterUsedL} suffix=" L" />
        <StatCard icon={TrendingDown} label="Potential savings" value={water.potentialSavingsL} suffix=" L" tone="good" />
        <StatCard icon={AlertTriangle} label="Water deficit" value={water.deficitL} suffix=" L" tone={water.deficitL > 0 ? "warn" : "neutral"} />
      </div>
    </div>
  );
}
