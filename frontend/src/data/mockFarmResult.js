// Shape mirrors what agri_engine.py is expected to return once wired up:
// crop prediction + probabilities, water plan, alternatives, irrigation advice.
export const MOCK_FARM_RESULT = {
  crop: {
    recommended: "Maize",
    confidence: 0.68,
    probabilities: [
      { crop: "Maize", probability: 0.68 },
      { crop: "Cotton", probability: 0.19 },
      { crop: "Sugarcane", probability: 0.07 },
      { crop: "Wheat", probability: 0.04 },
    ],
  },
  water: {
    theoreticalRequirementL: 812000,
    optimizedRequirementL: 671000,
    availableWaterL: 568000,
    waterUsedL: 542000,
    potentialSavingsL: 141000,
    deficitL: 103000,
    sufficiencyPct: 84.64,
    status: "Moderate", // "Sufficient" | "Moderate" | "Critical"
  },
  irrigation: {
    priority: "Medium",
    recommendation:
      "Irrigate within the next 2 days to keep root-zone moisture above the critical threshold for tasseling maize.",
    soilMoistureAdvice:
      "Soil moisture is trending down but not yet at stress levels — monitor daily rather than irrigating immediately.",
    methodAdvice:
      "Drip irrigation would cut water use by roughly 18% versus your current flood method on this plot size.",
  },
  alternatives: ["Millet", "Groundnut", "Tomato", "Wheat"],
};

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
