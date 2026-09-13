import pandas as pd
from pathlib import Path


def load_dataset():
    project_root = Path(__file__).resolve().parent.parent

    file_path = (
        project_root
        / "data"
        / "processed"
        / "processed_agriculture_dataset.csv"
    )

    return pd.read_csv(file_path)


def analyze_crops():
    data = load_dataset()

    columns_to_analyze = [
        "Nitrogen",
        "Phosphorus",
        "Potassium",
        "Soil_pH",
        "Temperature_C",
        "Humidity_%",
        "Rainfall_mm",
        "Soil_Moisture_%",
        "Water_Requirement_mm",
        "Yield_ton_per_ha",
    ]

    crop_summary = (
        data
        .groupby("Crop")[columns_to_analyze]
        .mean()
        .round(2)
    )

    print("\n--- AVERAGE CONDITIONS BY CROP ---")
    print(crop_summary.to_string())

    print("\n--- CROP RECORD COUNTS ---")
    print(data["Crop"].value_counts().sort_index())


if __name__ == "__main__":
    analyze_crops()