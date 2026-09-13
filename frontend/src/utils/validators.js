import { NUMERIC_FIELDS } from "../data/formFieldConfig";

export function validateField(key, rawValue) {
  const field = NUMERIC_FIELDS.find((f) => f.key === key);
  if (!field) return null;

  if (rawValue === "" || rawValue === null || rawValue === undefined) {
    return "This field is required.";
  }
  const value = Number(rawValue);
  if (Number.isNaN(value)) {
    return "Enter a number.";
  }
  if (value < field.min || value > field.max) {
    return `Enter a value between ${field.min} and ${field.max}.`;
  }
  return null;
}

export function validateForm(formState) {
  const errors = {};

  NUMERIC_FIELDS.forEach((field) => {
    const message = validateField(field.key, formState[field.key]);
    if (message) errors[field.key] = message;
  });

  if (!formState.Soil_Type) errors.Soil_Type = "Select a soil type.";
  if (!formState.Season) errors.Season = "Select a season.";
  if (!formState.Irrigation_Type) errors.Irrigation_Type = "Select an irrigation type.";

  return errors;
}

export function isFormValid(formState) {
  return Object.keys(validateForm(formState)).length === 0;
}
