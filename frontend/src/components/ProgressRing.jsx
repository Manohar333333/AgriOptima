import { useCountUp } from "../hooks/useCountUp";

const TONE_COLOR = {
  good: "var(--growth)",
  warn: "var(--amber)",
  critical: "var(--critical)",
  neutral: "var(--water)",
};

export default function ProgressRing({
  percent = 0,
  size = 140,
  strokeWidth = 10,
  tone = "neutral",
  label,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const { ref, value } = useCountUp(percent, { decimals: 1 });
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference;

  return (
    <div ref={ref} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label ?? "Progress"}: ${percent}%`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-line)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={TONE_COLOR[tone]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset var(--duration-slow) var(--ease-out)" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--ink)"
          fontFamily="var(--font-display)"
          fontSize={size * 0.19}
        >
          {value}%
        </text>
      </svg>
      {label && <span style={{ fontSize: "0.875rem", color: "var(--ink-muted)" }}>{label}</span>}
    </div>
  );
}
