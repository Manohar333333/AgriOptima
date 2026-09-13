const API_BASE_URL = "http://localhost:8000";

function normalizeResult(data) {
  const probabilities = (data.probabilities ?? []).map((item) => ({
    crop: item.Crop,
    probability: item.Probability,
  }));

  const topProbability = probabilities[0]?.probability ?? 0;

  return {
    crop: {
      recommended: data.recommended_crop,
      confidence: topProbability,
      probabilities,
    },

    water: {
      crop: data.water_plan.crop,
      farm_area_ha: data.water_plan.farm_area_ha,
      farmAreaHa: data.water_plan.farm_area_ha,
      water_requirement_mm: data.water_plan.water_requirement_mm,
      requirementMm: data.water_plan.water_requirement_mm,
      irrigation_advice: data.water_plan.irrigation_advice,
      irrigationAdvice: data.water_plan.irrigation_advice,
      status: data.water_plan.water_status,
      sufficiencyPct: data.water_plan.water_sufficiency_percent,
      theoreticalRequirementL: data.water_plan.theoretical_water_liters,
      optimizedRequirementL: data.water_plan.optimized_water_liters,
      availableWaterL: data.water_plan.available_water_liters,
      waterUsedL: data.water_plan.water_used_liters,
      potentialSavingsL: data.water_plan.potential_water_saving_liters,
      deficitL: data.water_plan.water_deficit_liters,
    },

    irrigation: {
      priority: data.irrigation.priority,
      recommendation: data.irrigation.recommendation,
      soilMoistureAdvice: data.irrigation.soil_moisture_advice,
      methodAdvice: data.irrigation.irrigation_method_advice,
    },

    alternatives: (data.alternatives ?? []).map((item) => {
      if (typeof item === "string") return { crop: item };
      return {
        crop: item.Crop,
        waterRequirementMm: item.Water_Requirement_mm,
        water_requirement_mm: item.Water_Requirement_mm,
        optimizedWaterL: item.Optimized_Water_Liters,
        optimized_water_liters: item.Optimized_Water_Liters,
        availableWaterL: item.Available_Water_Liters,
        available_water_liters: item.Available_Water_Liters,
        waterDeficitL: item.Water_Deficit_Liters,
        water_deficit_liters: item.Water_Deficit_Liters,
        waterSufficiencyPct: item["Water_Sufficiency_%"] ?? item.water_sufficiency_percent,
        water_sufficiency_percent: item["Water_Sufficiency_%"] ?? item.water_sufficiency_percent,
        waterStatus: item.Water_Status ?? item.water_status,
        water_status: item.Water_Status ?? item.water_status,
      };
    }),
  };
}

export async function analyzeFarm(farmInput) {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(farmInput),
  });

  if (!response.ok) {
    throw new Error(`Analysis request failed (${response.status})`);
  }

  const data = await response.json();

  return normalizeResult(data);
}