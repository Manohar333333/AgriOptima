import { useCallback, useEffect, useRef, useState } from "react";
import { analyzeFarm } from "../services/api";
import { validateForm } from "../utils/validators";

const INITIAL_FORM = {
  Soil_Type: "",
  Season: "",
  Nitrogen: "",
  Phosphorus: "",
  Potassium: "",
  Soil_pH: "",
  Temperature_C: "",
  Humidity: "",
  Rainfall_mm: "",
  Soil_Moisture: "",
  Farm_Area_ha: "",
  Water_Availability_L: "",
  Irrigation_Type: "",
};

export function useFarmAnalysis() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  const submittingRef = useRef(false);
  useEffect(() => {
  if (status === "success" && result) {
    requestAnimationFrame(() => {
      const resultsSection = document.getElementById("results");

      if (resultsSection) {
        const navbar = document.querySelector(".navbar");
        const navHeight = navbar ? navbar.getBoundingClientRect().height : 0;
        const targetY =
          window.scrollY + resultsSection.getBoundingClientRect().top - navHeight;

        window.scrollTo({
          top: Math.max(targetY, 0),
          behavior: "smooth",
        });
      }
    });
  }
}, [status, result]);

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  }, []);

  const submit = useCallback(async () => {
    if (submittingRef.current) {
      return { ok: false };
    }

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return { ok: false };
    }

    submittingRef.current = true;
    setStatus("loading");
    setApiError(null);

    try {
      const data = await analyzeFarm(form);

      console.log("API RESULT RECEIVED:", data);

      setResult(data);
      setStatus("success");

      console.log("SETTING SUCCESS");

      return { ok: true };
    } catch (err) {
      console.error("ANALYSIS ERROR:", err);

      setApiError(
        err.message || "Something went wrong analyzing your farm."
      );

      setStatus("error");

      return { ok: false };
    } finally {
      submittingRef.current = false;
    }
  }, [form]);

  const reset = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStatus("idle");
    setResult(null);
    setApiError(null);
    submittingRef.current = false;
  }, []);

  return {
    form,
    errors,
    status,
    result,
    apiError,
    setField,
    submit,
    reset,
  };
}