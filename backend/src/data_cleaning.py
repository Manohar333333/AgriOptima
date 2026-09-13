import pandas as pd
from pathlib import Path


def load_raw_data():
    project_root = Path(__file__).resolve().parent.parent

    file_path = (
        project_root
        / "data"
        / "raw"
        / "agriculture_dataset.csv"
    )

    return pd.read_csv(file_path)


def clean_data(data):
    print("Starting data cleaning...")

    # Remove duplicate records
    duplicates = data.duplicated().sum()
    print(f"Duplicate rows found: {duplicates}")

    data = data.drop_duplicates()

    # Check missing values
    missing_values = data.isnull().sum().sum()
    print(f"Missing values found: {missing_values}")

    # Remove rows containing missing values
    data = data.dropna()

    # Ensure numerical columns contain valid values
    numerical_columns = [
        "Nitrogen",
        "Phosphorus",
        "Potassium",
        "Soil_pH",
        "Temperature_C",
        "Humidity_%",
        "Rainfall_mm",
        "Soil_Moisture_%",
        "Farm_Area_ha",
        "Water_Availability_L",
        "Water_Requirement_mm",
        "Yield_ton_per_ha",
        "Water_Efficiency",
    ]

    for column in numerical_columns:
        data[column] = pd.to_numeric(
            data[column],
            errors="coerce",
        )

    # Remove rows that became invalid after conversion
    data = data.dropna()

    # Basic range validation
    data = data[
        (data["Soil_pH"] >= 0)
        & (data["Soil_pH"] <= 14)
    ]

    data = data[
        (data["Humidity_%"] >= 0)
        & (data["Humidity_%"] <= 100)
    ]

    data = data[
        (data["Soil_Moisture_%"] >= 0)
        & (data["Soil_Moisture_%"] <= 100)
    ]

    data = data[
        (data["Farm_Area_ha"] > 0)
        & (data["Water_Availability_L"] > 0)
        & (data["Water_Requirement_mm"] > 0)
        & (data["Yield_ton_per_ha"] > 0)
    ]

    return data


def save_processed_data(data):
    project_root = Path(__file__).resolve().parent.parent

    output_directory = (
        project_root
        / "data"
        / "processed"
    )

    output_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    output_file = (
        output_directory
        / "processed_agriculture_dataset.csv"
    )

    data.to_csv(
        output_file,
        index=False,
    )

    print("\nCleaned dataset saved successfully!")
    print(f"Records remaining: {len(data)}")
    print(f"Columns: {len(data.columns)}")
    print(f"Saved to: {output_file}")


def main():
    data = load_raw_data()

    print(f"Original records: {len(data)}")

    cleaned_data = clean_data(data)

    save_processed_data(cleaned_data)


if __name__ == "__main__":
    main()