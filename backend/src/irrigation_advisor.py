def recommend_irrigation(
    water_status,
    soil_moisture,
    irrigation_type,
):
    if water_status == "Critical":
        priority = "High"
        recommendation = (
            "Reduce water usage and prioritize "
            "essential irrigation."
        )

    elif water_status == "Moderate":
        priority = "Medium"
        recommendation = (
            "Use efficient irrigation and monitor "
            "soil moisture regularly."
        )

    else:
        priority = "Low"
        recommendation = (
            "Maintain normal irrigation while "
            "monitoring soil moisture."
        )

    if soil_moisture < 30:
        moisture_advice = (
            "Soil moisture is low. Irrigation "
            "may be required soon."
        )

    elif soil_moisture < 60:
        moisture_advice = (
            "Soil moisture is at a moderate level."
        )

    else:
        moisture_advice = (
            "Soil moisture is currently adequate."
        )

    irrigation_methods = {
        "Drip": (
            "Recommended for efficient water delivery "
            "directly to the crop root zone."
        ),
        "Sprinkler": (
            "Suitable for uniform irrigation across "
            "the field."
        ),
        "Furrow": (
            "Good for row crops. Monitor furrow depth and consider "
            "surge flow or switching to drip to minimize percolation losses."
        ),
        "Flood": (
            "Higher water use. Consider switching to "
            "drip or sprinkler irrigation when practical."
        ),
        "Rainfed": (
            "Highly dependent on rainfall. Implement in-situ moisture "
            "conservation (mulching, contour bunding) and prepare for "
            "supplemental deficit irrigation."
        ),
    }

    method_advice = irrigation_methods.get(
        irrigation_type,
        "Use an irrigation method appropriate for the crop and field."
    )

    return {
        "priority": priority,
        "recommendation": recommendation,
        "soil_moisture_advice": moisture_advice,
        "irrigation_method_advice": method_advice,
    }


if __name__ == "__main__":
    result = recommend_irrigation(
        water_status="Moderate",
        soil_moisture=50,
        irrigation_type="Drip",
    )

    print("\n--- IRRIGATION ADVISOR ---")
    for key, value in result.items():
        print(f"{key}: {value}")