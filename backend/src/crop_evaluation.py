import pandas as pd
import joblib
from pathlib import Path
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report,
)

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


def evaluate_model():
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
    predictions = model.predict(X_test)

    accuracy = accuracy_score(
        y_test,
        predictions,
    )

    print("\n--- OVERALL ACCURACY ---")
    print(f"{accuracy * 100:.2f}%")

    print("\n--- CLASSIFICATION REPORT ---")
    print(
        classification_report(
            y_test,
            predictions,
        )
    )

    labels = sorted(y_test.unique())

    matrix = confusion_matrix(
        y_test,
        predictions,
        labels=labels,
    )

    confusion = pd.DataFrame(
        matrix,
        index=[f"Actual_{label}" for label in labels],
        columns=[f"Predicted_{label}" for label in labels],
    )

    print("\n--- CONFUSION MATRIX ---")
    print(confusion)

    print("\n--- MOST COMMON WRONG PREDICTIONS ---")
    error_data = pd.DataFrame(
        {
            "Actual": y_test.values,
            "Predicted": predictions,
        }
    )

    errors = error_data[
        error_data["Actual"] != error_data["Predicted"]
    ]

    error_pairs = (
        errors
        .groupby(["Actual", "Predicted"])
        .size()
        .reset_index(name="Count")
        .sort_values(
            "Count",
            ascending=False,
        )
    )

    print(error_pairs.head(15).to_string(index=False))


if __name__ == "__main__":
    evaluate_model()