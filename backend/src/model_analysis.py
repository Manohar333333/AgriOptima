import pandas as pd
import joblib
from pathlib import Path

try:
    from backend.src.ml_preprocessing import prepare_crop_data
except (ImportError, ModuleNotFoundError):
    from ml_preprocessing import prepare_crop_data


def load_dataset():
    project_root = Path(__file__).resolve().parent.parent
    file_path = (
        project_root
        / "data"
        / "processed"
        / "processed_agriculture_dataset.csv"
    )
    return pd.read_csv(file_path)


def analyze_model():
    data = load_dataset()

    (
        X_train,
        X_test,
        y_train,
        y_test,
        encoder,
    ) = prepare_crop_data(data)

    project_root = Path(__file__).resolve().parent.parent
    model_path = (
        project_root
        / "models"
        / "crop_model.pkl"
    )

    model = joblib.load(model_path)
    importance = model.feature_importances_

    feature_importance = pd.DataFrame(
        {
            "Feature": X_train.columns,
            "Importance": importance,
        }
    )

    feature_importance = feature_importance.sort_values(
        by="Importance",
        ascending=False,
    )

    print("\n--- FEATURE IMPORTANCE ---")
    for _, row in feature_importance.iterrows():
        print(
            f"{row['Feature']:<35}"
            f"{row['Importance']:.4f}"
        )


if __name__ == "__main__":
    analyze_model()