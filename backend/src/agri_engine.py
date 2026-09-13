try:
    from .crop_predictor import predict_crop
    from .water_optimizer import calculate_water_plan, recommend_water_efficient_crops
    from .irrigation_advisor import recommend_irrigation
except (ImportError, ModuleNotFoundError):
    from crop_predictor import predict_crop
    from water_optimizer import calculate_water_plan, recommend_water_efficient_crops
    from irrigation_advisor import recommend_irrigation


def analyze_farm(farm_data):
    predicted_crop, probabilities = predict_crop(farm_data)

    irrigation_type = farm_data.get("Irrigation_Type", "Drip")

    water_plan = calculate_water_plan(
        crop=predicted_crop,
        farm_area=farm_data["Farm_Area_ha"],
        available_water=farm_data["Water_Availability_L"],
        irrigation_type=irrigation_type,
    )

    alternatives = recommend_water_efficient_crops(
        farm_area=farm_data["Farm_Area_ha"],
        available_water=farm_data["Water_Availability_L"],
        irrigation_type=irrigation_type,
        exclude_crop=predicted_crop,
    )

    irrigation = recommend_irrigation(
        water_status=water_plan["water_status"],
        soil_moisture=farm_data["Soil_Moisture_%"],
        irrigation_type=irrigation_type,
    )

    return {
        "recommended_crop": predicted_crop,
        "probabilities": probabilities,
        "water_plan": water_plan,
        "alternatives": alternatives,
        "irrigation": irrigation,
    }


if __name__ == "__main__":
    farm_data = {
        "Soil_Type": "Loamy",
        "Season": "Kharif",
        "Nitrogen": 100,
        "Phosphorus": 50,
        "Potassium": 60,
        "Soil_pH": 6.5,
        "Temperature_C": 27,
        "Humidity_%": 70,
        "Rainfall_mm": 500,
        "Soil_Moisture_%": 50,
        "Farm_Area_ha": 2,
        "Water_Availability_L": 14000000,
        "Irrigation_Type": "Drip",
    }

    result = analyze_farm(farm_data)

    print("\n--- AGRI OPTIMA ANALYSIS ---")
    print(f"Recommended crop: {result['recommended_crop']}")

    print("\n--- WATER PLAN ---")
    for key, value in result["water_plan"].items():
        print(f"{key}: {value}")

    print("\n--- WATER-SUITABLE ALTERNATIVES ---")
    alternatives = result["alternatives"]
    if hasattr(alternatives, "empty") and alternatives.empty:
        print("No suitable alternatives found.")
    elif hasattr(alternatives, "to_string"):
        print(alternatives.to_string(index=False))
    else:
        print(alternatives)

    print("\n--- IRRIGATION ADVISOR ---")
    for key, value in result["irrigation"].items():
        print(f"{key}: {value}")