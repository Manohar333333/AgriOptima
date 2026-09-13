import numpy as np
import pandas as pd
from pathlib import Path


NUMBER_OF_RECORDS = 5000
RANDOM_SEED = 42

rng = np.random.default_rng(RANDOM_SEED)

# Scientifically calibrated crop profiles
# Units:
#   nitrogen, phosphorus, potassium: kg/ha
#   soil_pH: pH units (0-14)
#   temperature: degrees Celsius
#   humidity: relative humidity %
#   rainfall: seasonal total mm
#   soil_moisture: root-zone volumetric %
#   water_requirement: seasonal total ETc in mm
#   yield_range: metric tonnes per hectare (t/ha)
CROP_PROFILES = {
    "Rice": {
        "nitrogen": (80, 140),
        "phosphorus": (35, 70),
        "potassium": (35, 70),
        "ph": (5.5, 6.8),
        "temperature": (24, 34),
        "humidity": (70, 95),
        "rainfall": (600, 1600),
        "soil_moisture": (60, 90),
        "water_requirement": (1200, 1800),
        "yield_range": (3.5, 6.5),
        "soils": ["Clay", "Loamy", "Alluvial"],
        "seasons": ["Kharif"],
        "irrigation": ["Flood", "Furrow", "Drip"],
    },
    "Maize": {
        "nitrogen": (70, 130),
        "phosphorus": (30, 65),
        "potassium": (30, 70),
        "ph": (5.8, 7.2),
        "temperature": (20, 32),
        "humidity": (50, 80),
        "rainfall": (300, 800),
        "soil_moisture": (40, 70),
        "water_requirement": (500, 800),
        "yield_range": (3.5, 6.5),
        "soils": ["Loamy", "Black", "Alluvial", "Red"],
        "seasons": ["Kharif", "Rabi"],
        "irrigation": ["Drip", "Sprinkler", "Furrow", "Rainfed"],
    },
    "Wheat": {
        "nitrogen": (60, 120),
        "phosphorus": (30, 65),
        "potassium": (30, 70),
        "ph": (6.0, 7.5),
        "temperature": (10, 25),
        "humidity": (40, 70),
        "rainfall": (50, 250),
        "soil_moisture": (30, 60),
        "water_requirement": (450, 650),
        "yield_range": (2.5, 5.5),
        "soils": ["Loamy", "Clay", "Alluvial"],
        "seasons": ["Rabi"],
        "irrigation": ["Sprinkler", "Flood", "Furrow", "Drip"],
    },
    "Millet": {
        "nitrogen": (30, 90),
        "phosphorus": (15, 50),
        "potassium": (20, 65),
        "ph": (5.5, 7.5),
        "temperature": (25, 36),
        "humidity": (30, 65),
        "rainfall": (150, 450),
        "soil_moisture": (20, 45),
        "water_requirement": (250, 450),
        "yield_range": (1.5, 3.5),
        "soils": ["Sandy", "Red", "Loamy"],
        "seasons": ["Kharif", "Zaid"],
        "irrigation": ["Rainfed", "Sprinkler", "Drip"],
    },
    "Groundnut": {
        "nitrogen": (25, 70),
        "phosphorus": (25, 60),
        "potassium": (30, 75),
        "ph": (5.5, 7.2),
        "temperature": (22, 32),
        "humidity": (50, 75),
        "rainfall": (350, 700),
        "soil_moisture": (30, 60),
        "water_requirement": (400, 650),
        "yield_range": (1.5, 3.2),
        "soils": ["Sandy", "Red", "Loamy", "Laterite"],
        "seasons": ["Kharif", "Rabi"],
        "irrigation": ["Sprinkler", "Drip", "Rainfed"],
    },
    "Cotton": {
        "nitrogen": (50, 120),
        "phosphorus": (25, 65),
        "potassium": (30, 80),
        "ph": (5.8, 8.0),
        "temperature": (21, 35),
        "humidity": (45, 75),
        "rainfall": (500, 1000),
        "soil_moisture": (35, 65),
        "water_requirement": (700, 1100),
        "yield_range": (1.5, 3.5),
        "soils": ["Black", "Loamy", "Alluvial"],
        "seasons": ["Kharif"],
        "irrigation": ["Drip", "Furrow", "Sprinkler"],
    },
    "Sugarcane": {
        "nitrogen": (90, 160),
        "phosphorus": (40, 85),
        "potassium": (50, 110),
        "ph": (6.0, 7.8),
        "temperature": (22, 36),
        "humidity": (65, 95),
        "rainfall": (700, 1600),
        "soil_moisture": (60, 90),
        "water_requirement": (1500, 2500),
        "yield_range": (60, 105),
        "soils": ["Loamy", "Clay", "Alluvial", "Black"],
        "seasons": ["Kharif", "Zaid"],
        "irrigation": ["Flood", "Furrow", "Drip"],
    },
    "Tomato": {
        "nitrogen": (50, 110),
        "phosphorus": (35, 75),
        "potassium": (40, 90),
        "ph": (5.5, 7.0),
        "temperature": (18, 30),
        "humidity": (50, 80),
        "rainfall": (200, 600),
        "soil_moisture": (35, 65),
        "water_requirement": (400, 650),
        "yield_range": (30, 70),
        "soils": ["Loamy", "Red", "Alluvial", "Laterite"],
        "seasons": ["Rabi", "Zaid", "Kharif"],
        "irrigation": ["Drip", "Sprinkler", "Furrow"],
    },
}

LITERS_PER_MM_PER_HECTARE = 10000


def sample_farm_area():
    """
    Samples realistic farm area in hectares across farm scales:
      - 70% small/medium farms: 0.2 to 10 ha
      - 20% large commercial farms: 10 to 100 ha
      - 10% very large / enterprise farms: 100 to 1000 ha
    """
    scale_selector = rng.random()
    if scale_selector < 0.70:
        area = rng.uniform(0.2, 10.0)
    elif scale_selector < 0.90:
        area = rng.uniform(10.0, 100.0)
    else:
        area = rng.uniform(100.0, 1000.0)
    return round(float(area), 2)


def generate_dataset(number_of_records=NUMBER_OF_RECORDS):
    records = []
    crop_names = list(CROP_PROFILES.keys())

    for farm_id in range(1, number_of_records + 1):
        crop = rng.choice(crop_names)
        profile = CROP_PROFILES[crop]

        nitrogen = int(rng.integers(profile["nitrogen"][0], profile["nitrogen"][1] + 1))
        phosphorus = int(rng.integers(profile["phosphorus"][0], profile["phosphorus"][1] + 1))
        potassium = int(rng.integers(profile["potassium"][0], profile["potassium"][1] + 1))

        ph = round(float(rng.uniform(profile["ph"][0], profile["ph"][1])), 2)
        temperature = round(float(rng.uniform(profile["temperature"][0], profile["temperature"][1])), 2)
        humidity = round(float(rng.uniform(profile["humidity"][0], profile["humidity"][1])), 2)
        rainfall = round(float(rng.uniform(profile["rainfall"][0], profile["rainfall"][1])), 2)
        soil_moisture = round(float(rng.uniform(profile["soil_moisture"][0], profile["soil_moisture"][1])), 2)

        soil_type = rng.choice(profile["soils"])
        season = rng.choice(profile["seasons"])
        irrigation_type = rng.choice(profile["irrigation"])

        # Farm Area in hectares
        farm_area = sample_farm_area()

        # Water requirement in mm over season (with climatic sensitivity)
        temp_mid = np.mean(profile["temperature"])
        hum_mid = np.mean(profile["humidity"])
        climatic_evap_factor = 1.0 + (temperature - temp_mid) * 0.012 - (humidity - hum_mid) * 0.005
        base_water_req = rng.uniform(profile["water_requirement"][0], profile["water_requirement"][1])
        water_requirement = round(
            float(np.clip(base_water_req * climatic_evap_factor, profile["water_requirement"][0] * 0.9, profile["water_requirement"][1] * 1.1)),
            2,
        )

        # Available water: Scaled physically with farm area
        # A farm's seasonal water availability is its seasonal irrigation water allocation depth (in mm) * area * 10,000
        # Available depth ranges realistically from 200 mm (scarce) to 1600 mm (abundant)
        available_depth_mm = float(rng.uniform(250.0, 1500.0))
        water_availability = round(float(farm_area * available_depth_mm * LITERS_PER_MM_PER_HECTARE), 2)

        # Yield calculation
        base_yield = rng.uniform(profile["yield_range"][0], profile["yield_range"][1])
        temperature_factor = max(0.75, 1.0 - abs(temperature - temp_mid) * 0.020)
        rainfall_mid = np.mean(profile["rainfall"])
        rainfall_factor = max(0.75, 1.0 - abs(rainfall - rainfall_mid) * 0.0008)
        nutrient_factor = float(np.clip(
            0.75 + (nitrogen / 400.0) + (phosphorus / 300.0) + (potassium / 400.0),
            0.75,
            1.20,
        ))

        yield_value = round(float(max(base_yield * temperature_factor * rainfall_factor * nutrient_factor, 0.5)), 2)
        water_efficiency = round(float(yield_value / water_requirement), 5)

        records.append({
            "Farm_ID": farm_id,
            "Crop": crop,
            "Soil_Type": soil_type,
            "Season": season,
            "Irrigation_Type": irrigation_type,
            "Nitrogen": nitrogen,
            "Phosphorus": phosphorus,
            "Potassium": potassium,
            "Soil_pH": ph,
            "Temperature_C": temperature,
            "Humidity_%": humidity,
            "Rainfall_mm": rainfall,
            "Soil_Moisture_%": soil_moisture,
            "Farm_Area_ha": farm_area,
            "Water_Availability_L": water_availability,
            "Water_Requirement_mm": water_requirement,
            "Yield_ton_per_ha": yield_value,
            "Water_Efficiency": water_efficiency,
        })

    return pd.DataFrame(records)


def save_dataset():
    project_root = Path(__file__).resolve().parent.parent
    output_directory = project_root / "data" / "raw"
    output_directory.mkdir(parents=True, exist_ok=True)
    output_file = output_directory / "agriculture_dataset.csv"

    dataset = generate_dataset()
    dataset.to_csv(output_file, index=False)

    print("Improved dataset created successfully!")
    print(f"Records: {len(dataset)}")
    print(f"Columns: {len(dataset.columns)}")
    print(f"Saved to: {output_file}")


if __name__ == "__main__":
    save_dataset()