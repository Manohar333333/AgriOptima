import { useCountUp } from "../hooks/useCountUp";
import "./StatCard.css";

export default function StatCard({
  icon: Icon,
  label,
  value,
  decimals = 0,
  suffix = "",
  tone = "neutral",
  helper,
}) {
  const numeric = typeof value === "number";
  const { ref, value: animated } = useCountUp(numeric ? value : 0, { decimals });

  return (
    <div className={`stat-card surface-interactive stat-card--${tone}`} ref={ref}>
      <div className="stat-card__head">
        {Icon && <Icon size={18} strokeWidth={1.8} aria-hidden="true" />}
        <span>{label}</span>
      </div>
      <div className="stat-card__value">
        {numeric ? animated : value}
        {suffix}
      </div>
      {helper && <p className="stat-card__helper">{helper}</p>}
    </div>
  );
}
