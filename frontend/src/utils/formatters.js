export function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatLitres(value) {
  if (value === null || value === undefined) return "—";
  if (value >= 1_000_000) return `${formatNumber(value / 1_000_000, 2)}M L`;
  if (value >= 1_000) return `${formatNumber(value / 1_000, 1)}K L`;
  return `${formatNumber(value)} L`;
}

export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined) return "—";
  return `${formatNumber(value, decimals)}%`;
}

// Maps a water status string to a semantic tone used for color + icon choice.
export function statusTone(status) {
  const s = (status || "").toLowerCase();
  if (s === "sufficient") return "good";
  if (s === "moderate") return "warn";
  if (s === "critical") return "critical";
  return "neutral";
}
