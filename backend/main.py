from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.src.agri_engine import analyze_farm
from backend.src.db import (
    check_database_connection,
    save_analysis,
    ensure_indexes,
    analysis_history,
)



app = FastAPI(title="AgriOptima API")

ensure_indexes()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FarmData(BaseModel):
    Soil_Type: str
    Season: str
    Nitrogen: float
    Phosphorus: float
    Potassium: float
    Soil_pH: float
    Temperature_C: float
    Humidity: float
    Rainfall_mm: float
    Soil_Moisture: float
    Farm_Area_ha: float
    Water_Availability_L: float
    Irrigation_Type: str

@app.get("/")
def root():
    return {"message": "AgriOptima API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/health/db")
def database_health():
    if check_database_connection():
        return {
            "status": "healthy",
            "database": "connected"
        }

    return {
        "status": "unhealthy",
        "database": "disconnected"
    }
@app.get("/analysis-history")
def get_analysis_history(limit: int = 20):
    limit = max(1, min(limit, 100))

    documents = (
        analysis_history
        .find()
        .sort("created_at", -1)
        .limit(limit)
    )

    history = []

    for document in documents:
        document["_id"] = str(document["_id"])
        document["created_at"] = document["created_at"].isoformat()
        history.append(document)

    return history


@app.post("/analyze")
def analyze(data: FarmData):
    farm_data = data.model_dump()

    farm_data["Humidity_%"] = farm_data.pop("Humidity")
    farm_data["Soil_Moisture_%"] = farm_data.pop("Soil_Moisture")

    result = analyze_farm(farm_data)

    result["probabilities"] = (
        result["probabilities"].to_dict(orient="records")
    )

    if hasattr(result["alternatives"], "to_dict"):
        result["alternatives"] = (
            result["alternatives"].to_dict(orient="records")
        )

    save_analysis(data.model_dump(), result)

    return result