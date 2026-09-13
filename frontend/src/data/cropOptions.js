// Metadata for the 8 crops the Random Forest model predicts among.
// Keys must match the class labels returned by crop_predictor.py exactly.
export const CROPS = {
  Cotton: { color: "#e4ded0", water: "medium" },
  Groundnut: { color: "#c9a26a", water: "low" },
  Maize: { color: "#e8c547", water: "medium" },
  Millet: { color: "#b3855a", water: "low" },
  Rice: { color: "#6fa8c0", water: "high" },
  Sugarcane: { color: "#7fae6a", water: "high" },
  Tomato: { color: "#c4694a", water: "medium" },
  Wheat: { color: "#d9b45c", water: "medium" },
};

export function cropColor(name) {
  return CROPS[name]?.color ?? "#86c08a";
}
