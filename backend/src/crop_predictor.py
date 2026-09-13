import pandas as pd
import joblib
from pathlib import Path


def load_model():
    project_root = Path(__file__).resolve().parent.parent

    model_path = project_root / "models" / "crop_model.pkl"
    encoder_path = project_root / "models" / "crop_encoder.pkl"

    model = joblib.load(model_path)
    encoder = joblib.load(encoder_path)

    return model, encoder


def predict_crop(farm_data):
    model, encoder = load_model()

    input_data = pd.DataFrame([farm_data])

    categorical_columns = [
        "Soil_Type",
        "Season",
        "Irrigation_Type",
    ]

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
    ]

    encoded_data = encoder.transform(
        input_data[categorical_columns]
    )

    encoded_columns = encoder.get_feature_names_out(
        categorical_columns
    )

    encoded_df = pd.DataFrame(
        encoded_data,
        columns=encoded_columns,
    )

    final_data = pd.concat(
        [
            input_data[numerical_columns].reset_index(drop=True),
            encoded_df.reset_index(drop=True),
        ],
        axis=1,
    )

    prediction = model.predict(final_data)[0]

    probabilities = model.predict_proba(final_data)[0]

    probability_data = pd.DataFrame(
        {
            "Crop": model.classes_,
            "Probability": probabilities,
        }
    ).sort_values(
        "Probability",
        ascending=False,
    )

    return prediction, probability_data


if __name__ == "__main__":
    sample_farm = {
        "Soil_Type": "Loamy",
        "Season": "Kharif",
        "Nitrogen": 100,
        "Phosphorus": 50,
        "Potassium": 60,
        "Soil_pH": 6.5,
        "Temperature_C": 27,
        "Humidity_%": 70,
        "Rainfall_mm": 120,
        "Soil_Moisture_%": 50,
        "Farm_Area_ha": 2,
        "Water_Availability_L": 10000000,
        "Irrigation_Type": "Drip",
    }

    prediction, probabilities = predict_crop(
        sample_farm
    )

    print("\n--- CROP PREDICTION ---")
    print(f"Recommended crop: {prediction}")

    print("\n--- CROP PROBABILITIES ---")
    print(probabilities.to_string(index=False))