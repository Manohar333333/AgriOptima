import math

try:
    from backend.src.agri_engine import analyze_farm
    from backend.src.water_optimizer import calculate_water_plan
except (ImportError, ModuleNotFoundError):
    from agri_engine import analyze_farm
    from water_optimizer import calculate_water_plan


def make_farm_input(
    soil_type="Loamy",
    season="Kharif",
    nitrogen=100.0,
    phosphorus=50.0,
    potassium=60.0,
    soil_ph=6.5,
    temperature=27.0,
    humidity=70.0,
    rainfall=600.0,
    soil_moisture=50.0,
    farm_area=2.0,
    available_water=14_000_000.0,
    irrigation_type="Drip",
):
    return {
        "Soil_Type": soil_type,
        "Season": season,
        "Nitrogen": nitrogen,
        "Phosphorus": phosphorus,
        "Potassium": potassium,
        "Soil_pH": soil_ph,
        "Temperature_C": temperature,
        "Humidity_%": humidity,
        "Rainfall_mm": rainfall,
        "Soil_Moisture_%": soil_moisture,
        "Farm_Area_ha": farm_area,
        "Water_Availability_L": available_water,
        "Irrigation_Type": irrigation_type,
    }


def test_farm_scales():
    print("\n" + "=" * 60)
    print("STEP 9 VALIDATION: TESTING REALISTIC FARM SCALES")
    print("=" * 60)

    # Required farm scales:
    # 1. Small farm: 0.5 ha
    # 2. Medium farm: 2 ha
    # 3. Example farm: 7 ha
    # 4. Large farm: 50 ha
    # 5. Very large farm: 100 ha
    # 6. Large agricultural operation: 1000 ha
    scales = [
        ("Small farm", 0.5, 3_500_000.0),
        ("Medium farm", 2.0, 14_000_000.0),
        ("Example farm", 7.0, 49_000_000.0),
        ("Large farm", 50.0, 350_000_000.0),
        ("Very large farm", 100.0, 700_000_000.0),
        ("Enterprise operation", 1000.0, 7_000_000_000.0),
    ]

    results = []

    for label, area, water in scales:
        farm_input = make_farm_input(farm_area=area, available_water=water)
        res = analyze_farm(farm_input)
        plan = res["water_plan"]
        alt_crops = (
            res["alternatives"]["Crop"].tolist()
            if hasattr(res["alternatives"], "empty") and not res["alternatives"].empty
            else []
        )

        results.append({
            "label": label,
            "area": area,
            "crop": res["recommended_crop"],
            "theoretical_L": plan["theoretical_water_liters"],
            "optimized_L": plan["optimized_water_liters"],
            "available_L": plan["available_water_liters"],
            "sufficiency_%": plan["water_sufficiency_percent"],
            "status": plan["water_status"],
            "alternatives_count": len(alt_crops),
        })

        print(f"\n[{label}] Area: {area} ha | Available: {water:,.0f} L")
        print(f"  Recommended Crop: {res['recommended_crop']}")
        print(f"  Theoretical Requirement: {plan['theoretical_water_liters']:,.0f} L")
        print(f"  Optimized Requirement:   {plan['optimized_water_liters']:,.0f} L")
        print(f"  Water Sufficiency:       {plan['water_sufficiency_percent']}% ({plan['water_status']})")
        print(f"  Alternatives Offered:    {', '.join(alt_crops[:4])}")

    return results


def test_linear_scaling():
    print("\n" + "=" * 60)
    print("VERIFYING MATHEMATICAL LINEAR WATER SCALING")
    print("=" * 60)

    # For any given crop, theoretical water must scale exactly linearly with farm area:
    # area2 / area1 == water2 / water1
    test_crop = "Maize"
    areas = [1.0, 2.0, 7.0, 50.0, 100.0, 1000.0]
    plans = {}

    for a in areas:
        plans[a] = calculate_water_plan(
            crop=test_crop,
            farm_area=a,
            available_water=a * 7_000_000.0,
            irrigation_type="Drip",
        )

    w1 = plans[1.0]["theoretical_water_liters"]
    w2 = plans[2.0]["theoretical_water_liters"]
    w7 = plans[7.0]["theoretical_water_liters"]
    w50 = plans[50.0]["theoretical_water_liters"]
    w100 = plans[100.0]["theoretical_water_liters"]
    w1000 = plans[1000.0]["theoretical_water_liters"]

    ratio_2_to_1 = w2 / w1
    ratio_7_to_2 = w7 / w2
    ratio_50_to_2 = w50 / w2
    ratio_1000_to_100 = w1000 / w100

    print(f"1 ha Requirement:    {w1:,.0f} L")
    print(f"2 ha Requirement:    {w2:,.0f} L  --> Ratio (2ha / 1ha): {ratio_2_to_1:.4f} (Expected: 2.0000)")
    print(f"7 ha Requirement:    {w7:,.0f} L  --> Ratio (7ha / 2ha): {ratio_7_to_2:.4f} (Expected: 3.5000)")
    print(f"50 ha Requirement:   {w50:,.0f} L  --> Ratio (50ha / 2ha): {ratio_50_to_2:.4f} (Expected: 25.0000)")
    print(f"1000 ha Requirement: {w1000:,.0f} L  --> Ratio (1000ha / 100ha): {ratio_1000_to_100:.4f} (Expected: 10.0000)")

    assert math.isclose(ratio_2_to_1, 2.0, rel_tol=1e-5), f"2ha to 1ha ratio failed: {ratio_2_to_1}"
    assert math.isclose(ratio_7_to_2, 3.5, rel_tol=1e-5), f"7ha to 2ha ratio failed: {ratio_7_to_2}"
    assert math.isclose(ratio_50_to_2, 25.0, rel_tol=1e-5), f"50ha to 2ha ratio failed: {ratio_50_to_2}"
    assert math.isclose(ratio_1000_to_100, 10.0, rel_tol=1e-5), f"1000ha to 100ha ratio failed: {ratio_1000_to_100}"

    print("\n>>> LINEAR SCALING ASSERTIONS PASSED! Mathematical consistency confirmed. <<<")


def test_multiple_crops_and_seasons():
    print("\n" + "=" * 60)
    print("TESTING MULTIPLE CROPS AND SEASONS")
    print("=" * 60)

    cases = [
        ("Rice in Kharif (Wet)", make_farm_input(soil_type="Clay", season="Kharif", rainfall=1200, humidity=85, farm_area=5, available_water=40_000_000, irrigation_type="Flood")),
        ("Wheat in Rabi (Cool/Dry)", make_farm_input(soil_type="Loamy", season="Rabi", temperature=16, rainfall=100, humidity=50, farm_area=4, available_water=25_000_000, irrigation_type="Sprinkler")),
        ("Cotton in Kharif (Black Soil)", make_farm_input(soil_type="Black", season="Kharif", temperature=30, rainfall=800, humidity=65, farm_area=10, available_water=70_000_000, irrigation_type="Drip")),
        ("Millet in Zaid (Semi-arid)", make_farm_input(soil_type="Sandy", season="Zaid", temperature=32, rainfall=200, humidity=40, farm_area=3, available_water=10_000_000, irrigation_type="Rainfed")),
    ]

    for label, farm in cases:
        res = analyze_farm(farm)
        print(f"\nScenario: {label}")
        print(f"  Recommended: {res['recommended_crop']}")
        print(f"  Sufficiency: {res['water_plan']['water_sufficiency_percent']}% ({res['water_plan']['water_status']})")
        print(f"  Advice:      {res['irrigation']['recommendation']}")


def main():
    test_farm_scales()
    test_linear_scaling()
    test_multiple_crops_and_seasons()
    print("\n" + "=" * 60)
    print("ALL SYSTEM TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 60)


if __name__ == "__main__":
    main()