// Drives the Farm Analysis form. Dropdown option lists (Soil_Type, Season,
// Irrigation_Type) are placeholders reflecting common Indian cropping
// categories — replace with the exact category strings your
// ml_preprocessing.py encoder expects before wiring the real API.

export const SOIL_TYPES = [
  "Alluvial",
  "Black",
  "Red",
  "Laterite",
  "Sandy",
  "Clay",
  "Loamy",
];

export const SEASONS = ["Kharif", "Rabi", "Zaid"];

export const IRRIGATION_TYPES = [
  "Drip",
  "Sprinkler",
  "Flood",
  "Furrow",
  "Rainfed",
];

// Each numeric field: key, label (farmer-facing, no snake_case), unit,
// plausible min/max for validation + slider bounds, and a short helper.
export const NUMERIC_FIELDS = [
  {
    key: "Nitrogen",
    label: "Nitrogen (N)",
    unit: "kg/ha",
    min: 0,
    max: 300,
    step: 1,
    helper: "Nitrogen level in your soil test report.",
  },
  {
    key: "Phosphorus",
    label: "Phosphorus (P)",
    unit: "kg/ha",
    min: 0,
    max: 200,
    step: 1,
    helper: "Phosphorus level in your soil test report.",
  },
  {
    key: "Potassium",
    label: "Potassium (K)",
    unit: "kg/ha",
    min: 0,
    max: 300,
    step: 1,
    helper: "Potassium level in your soil test report.",
  },
  {
    key: "Soil_pH",
    label: "Soil pH",
    unit: "pH",
    min: 3.5,
    max: 9.5,
    step: 0.1,
    helper: "Acidity or alkalinity of your soil, 0–14 scale.",
  },
  {
    key: "Temperature_C",
    label: "Temperature",
    unit: "°C",
    min: -5,
    max: 50,
    step: 0.5,
    helper: "Average daytime temperature for the season.",
  },
  {
    key: "Humidity",
    label: "Humidity",
    unit: "%",
    min: 0,
    max: 100,
    step: 1,
    helper: "Average relative humidity.",
  },
  {
    key: "Rainfall_mm",
    label: "Rainfall",
    unit: "mm",
    min: 0,
    max: 4000,
    step: 5,
    helper: "Expected or recorded rainfall for the season.",
  },
  {
    key: "Soil_Moisture",
    label: "Soil Moisture",
    unit: "%",
    min: 0,
    max: 100,
    step: 1,
    helper: "Current moisture content of the soil.",
  },
  {
    key: "Farm_Area_ha",
    label: "Farm Area",
    unit: "hectares",
    min: 0.1,
    max: 1000,
    step: 0.1,
    helper: "Total cultivable area for this plot.",
  },
  {
    key: "Water_Availability_L",
    label: "Water Availability",
    unit: "litres",
    min: 0,
    max: 50000000,
    step: 1000,
    helper: "Total water you can access for this farm and season.",
  },
];
