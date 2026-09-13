import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder


def load_processed_data():
    project_root = Path(__file__).resolve().parent.parent

    file_path = (
        project_root
        / "data"
        / "processed"
        / "processed_agriculture_dataset.csv"
    )

    return pd.read_csv(file_path)


def prepare_crop_data(data):
    # Features used by the crop recommendation model
    feature_columns = [
        "Soil_Type",
        "Season",
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
        "Irrigation_Type",
    ]

    target_column = "Crop"

    X = data[feature_columns].copy()
    y = data[target_column].copy()

    categorical_columns = [
        "Soil_Type",
        "Season",
        "Irrigation_Type",
    ]

    numerical_columns = [
        column
        for column in feature_columns
        if column not in categorical_columns
    ]

    encoder = OneHotEncoder(
        handle_unknown="ignore",
        sparse_output=False,
    )

    encoded_data = encoder.fit_transform(
        X[categorical_columns]
    )

    encoded_columns = encoder.get_feature_names_out(
        categorical_columns
    )

    encoded_df = pd.DataFrame(
        encoded_data,
        columns=encoded_columns,
        index=X.index,
    )

    X_final = pd.concat(
        [
            X[numerical_columns],
            encoded_df,
        ],
        axis=1,
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X_final,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    return (
        X_train,
        X_test,
        y_train,
        y_test,
        encoder,
    )


def main():
    data = load_processed_data()

    print("Dataset loaded successfully!")
    print(f"Total records: {len(data)}")

    (
        X_train,
        X_test,
        y_train,
        y_test,
        encoder,
    ) = prepare_crop_data(data)

    print("\n--- ML DATA PREPARATION ---")
    print(f"Training records: {len(X_train)}")
    print(f"Testing records: {len(X_test)}")
    print(f"Features after encoding: {X_train.shape[1]}")

    print("\n--- TARGET DISTRIBUTION ---")
    print(y_train.value_counts())

    print("\n--- SAMPLE FEATURES ---")
    print(X_train.head())

    print("\nData is ready for ML training!")


if __name__ == "__main__":
    main()