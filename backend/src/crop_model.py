import pandas as pd
import joblib
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

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


def train_model():
    data = load_dataset()

    (
        X_train,
        X_test,
        y_train,
        y_test,
        encoder,
    ) = prepare_crop_data(data)

    print("Training Random Forest model...")

    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=16,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
        class_weight="balanced",
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(
        y_test,
        predictions,
    )

    print("\n--- MODEL RESULTS ---")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Accuracy percentage: {accuracy * 100:.2f}%")

    print("\n--- CLASSIFICATION REPORT ---")
    print(
        classification_report(
            y_test,
            predictions,
        )
    )

    project_root = Path(__file__).resolve().parent.parent
    models_directory = project_root / "models"

    models_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    model_path = models_directory / "crop_model.pkl"
    encoder_path = models_directory / "crop_encoder.pkl"

    joblib.dump(
        model,
        model_path,
    )

    joblib.dump(
        encoder,
        encoder_path,
    )

    print("\n--- MODEL SAVED ---")
    print(f"Model: {model_path} ({model_path.stat().st_size / (1024 * 1024):.2f} MB)")
    print(f"Encoder: {encoder_path}")


if __name__ == "__main__":
    train_model()