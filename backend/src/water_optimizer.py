import pandas as pd
from pathlib import Path

LITERS_PER_MM_PER_HECTARE = 10000

# Irrigation efficiency factors (fraction of water effectively delivered to crop root zone)
IRRIGATION_EFFICIENCIES = {
    "Drip": 0.90,
    "Sprinkler": 0.80,
    "Furrow": 0.65,
    "Flood": 0.60,
    "Rainfed": 0.60,
}


def load_crop_data():
    project_root = Path(__file__).resolve().parent.parent
    file_path = (
        project_root
        / "data"
        / "processed"
        / "processed_agriculture_dataset.csv"
    )
    return pd.read_csv(file_path)


def calculate_water_plan(
    crop,
    farm_area,
    available_water,
    irrigation_type="Drip",
    irrigation_efficiency=None,
):
    if farm_area <= 0:
        raise ValueError("Farm area must be greater than zero.")

    if available_water < 0:
        raise ValueError("Available water cannot be negative.")

    data = load_crop_data()
    crop_data = data[data["Crop"] == crop]

    if crop_data.empty:
        raise ValueError(f"Crop '{crop}' not found in dataset.")

    # Seasonal crop water requirement depth in mm (ETc)
    water_requirement = float(crop_data["Water_Requirement_mm"].median())

    # Baseline theoretical crop water volume in Litres:
    # 1 mm depth over 1 ha = 10,000 Litres
    theoretical_water = float(
        water_requirement * farm_area * LITERS_PER_MM_PER_HECTARE
    )

    # Technology / precision irrigation savings factor:
    # Precision methods (drip, sprinkler) reduce gross water demand compared to baseline flood.
    eff = irrigation_efficiency or IRRIGATION_EFFICIENCIES.get(irrigation_type, 0.90)
    # Optimized water requirement ratio: Drip achieves ~85% of baseline (15% savings), Sprinkler ~90%, Flood ~90% with precision scheduling
    saving_ratio = max(0.05, min(0.25, (eff - 0.55) * 0.40))
    optimized_requirement = float(theoretical_water * (1.0 - saving_ratio))

    water_used = float(min(optimized_requirement, available_water))
    water_deficit = float(max(optimized_requirement - available_water, 0.0))
    potential_saving = float(max(theoretical_water - optimized_requirement, 0.0))

    if optimized_requirement > 0:
        water_sufficiency = float(
            min(available_water / optimized_requirement, 1.0)
        )
    else:
        water_sufficiency = 1.0

    sufficiency_percent = round(water_sufficiency * 100.0, 2)

    if sufficiency_percent >= 90.0:
        water_status = "Sufficient"
        irrigation_advice = "Normal irrigation can be followed."
    elif sufficiency_percent >= 70.0:
        water_status = "Moderate"
        irrigation_advice = (
            "Use efficient irrigation and monitor soil moisture."
        )
    else:
        water_status = "Critical"
        irrigation_advice = (
            "Available water is insufficient. "
            "Consider a lower-water crop or reduce irrigation demand."
        )

    return {
        "crop": str(crop),
        "farm_area_ha": round(float(farm_area), 2),
        "water_requirement_mm": round(float(water_requirement), 2),
        "theoretical_water_liters": round(float(theoretical_water), 2),
        "optimized_water_liters": round(float(optimized_requirement), 2),
        "available_water_liters": round(float(available_water), 2),
        "water_used_liters": round(float(water_used), 2),
        "potential_water_saving_liters": round(float(potential_saving), 2),
        "water_deficit_liters": round(float(water_deficit), 2),
        "water_sufficiency_percent": sufficiency_percent,
        "water_status": water_status,
        "irrigation_advice": irrigation_advice,
    }


def compare_crops(farm_area, available_water, irrigation_type="Drip"):
    data = load_crop_data()
    results = []

    for crop in sorted(data["Crop"].unique()):
        plan = calculate_water_plan(
            crop=crop,
            farm_area=farm_area,
            available_water=available_water,
            irrigation_type=irrigation_type,
        )

        results.append(
            {
                "Crop": plan["crop"],
                "Water_Requirement_mm": plan["water_requirement_mm"],
                "Optimized_Water_Liters": plan["optimized_water_liters"],
                "Available_Water_Liters": plan["available_water_liters"],
                "Water_Deficit_Liters": plan["water_deficit_liters"],
                "Water_Sufficiency_%": plan["water_sufficiency_percent"],
                "Water_Status": plan["water_status"],
            }
        )

    return pd.DataFrame(results)


def recommend_water_efficient_crops(
    farm_area,
    available_water,
    irrigation_type="Drip",
    exclude_crop=None,
):
    comparison = compare_crops(
        farm_area=farm_area,
        available_water=available_water,
        irrigation_type=irrigation_type,
    )

    if exclude_crop:
        comparison = comparison[
            comparison["Crop"] != exclude_crop
        ]

    if comparison.empty:
        return comparison.reset_index(drop=True)

    # Classify crops by water sufficiency
    sufficient = comparison[
        comparison["Water_Sufficiency_%"] >= 90.0
    ].sort_values(
        by=["Water_Requirement_mm", "Optimized_Water_Liters"],
        ascending=[True, True],
    )

    moderate = comparison[
        (comparison["Water_Sufficiency_%"] >= 70.0)
        & (comparison["Water_Sufficiency_%"] < 90.0)
    ].sort_values(
        by=["Water_Sufficiency_%", "Water_Requirement_mm"],
        ascending=[False, True],
    )

    critical = comparison[
        comparison["Water_Sufficiency_%"] < 70.0
    ].sort_values(
        by=["Water_Requirement_mm", "Water_Sufficiency_%"],
        ascending=[True, False],
    )

    # If we have sufficient crops, return them first (plus moderate crops if list is small)
    if not sufficient.empty:
        if len(sufficient) >= 4:
            return sufficient.reset_index(drop=True)
        else:
            combined = pd.concat([sufficient, moderate]).head(5)
            return combined.reset_index(drop=True)

    # If no crop is fully sufficient, offer moderate crops with clear status
    if not moderate.empty:
        combined = pd.concat([moderate, critical]).head(5)
        return combined.reset_index(drop=True)

    # If all crops are deficient, present the least demanding alternatives with critical status
    return critical.head(5).reset_index(drop=True)


if __name__ == "__main__":
    farm_area = 2.0
    available_water = 10_000_000.0

    result = calculate_water_plan(
        crop="Rice",
        farm_area=farm_area,
        available_water=available_water,
        irrigation_type="Drip",
    )

    print("\n--- SELECTED CROP WATER PLAN ---")
    for key, value in result.items():
        print(f"{key}: {value}")

    print("\n--- WATER-EFFICIENT ALTERNATIVES ---")
    alternatives = recommend_water_efficient_crops(
        farm_area=farm_area,
        available_water=available_water,
        irrigation_type="Drip",
        exclude_crop="Rice",
    )

    print(alternatives.to_string(index=False))