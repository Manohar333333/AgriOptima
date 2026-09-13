import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/Button";
import { NUMERIC_FIELDS, SOIL_TYPES, SEASONS, IRRIGATION_TYPES } from "../data/formFieldConfig";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./FarmAnalysisForm.css";

export default function FarmAnalysisForm({ farmAnalysis }) {
  const { form, errors, status, setField, submit } = farmAnalysis;
  const revealRef = useScrollReveal("[data-reveal]", { blur: false });
  const gridRef = useRef(null);
  const isLoading = status === "loading";

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleWheel = (e) => {
      const input = e.target;
      if (!input || input.tagName !== "INPUT" || input.type !== "number") return;

      const fieldKey = input.name;
      const field = NUMERIC_FIELDS.find((f) => f.key === fieldKey);
      if (!field) return;

      e.preventDefault();
      if (!e.deltaY) return;

      const currentVal = form[field.key];
      const step = Number(field.step) || 1;
      const min = field.min !== undefined ? Number(field.min) : -Infinity;
      const max = field.max !== undefined ? Number(field.max) : Infinity;

      const stepStr = String(field.step ?? "1");
      const decimals = stepStr.includes(".") ? stepStr.split(".")[1].length : 0;

      let baseVal;
      if (
        currentVal === "" ||
        currentVal === null ||
        currentVal === undefined ||
        isNaN(Number(currentVal))
      ) {
        baseVal = min > -Infinity && min > 0 ? min : 0;
      } else {
        baseVal = Number(currentVal);
      }

      // Swiping UP on laptop touchpad / scrolling up -> value increases
      // Swiping DOWN on laptop touchpad / scrolling down -> value decreases
      const nextVal = e.deltaY > 0 ? baseVal + step : baseVal - step;
      const clamped = Math.max(min, Math.min(max, nextVal));
      const formatted = Number(clamped.toFixed(decimals));

      setField(field.key, String(formatted));
    };

    grid.addEventListener("wheel", handleWheel, { passive: false });
    return () => grid.removeEventListener("wheel", handleWheel, { passive: false });
  }, [form, setField]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  return (
    <section id="farm-analysis" className="section farm-form">
      <div className="container" ref={revealRef}>
        <SectionHeading
          tag="Farm analysis"
          title="Tell us about your farm"
          subtitle="These are the same conditions your soil test and local weather data already describe. Nothing here requires technical knowledge."
        />

        <form className="farm-form__form" onSubmit={handleSubmit} noValidate data-reveal>
          <div className="farm-form__grid" ref={gridRef}>
            <Field label="Soil type" error={errors.Soil_Type}>
              <select
                value={form.Soil_Type}
                onChange={(e) => setField("Soil_Type", e.target.value)}
                aria-invalid={!!errors.Soil_Type}
              >
                <option value="">Select soil type</option>
                {SOIL_TYPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Season" error={errors.Season}>
              <select
                value={form.Season}
                onChange={(e) => setField("Season", e.target.value)}
                aria-invalid={!!errors.Season}
              >
                <option value="">Select season</option>
                {SEASONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Irrigation type" error={errors.Irrigation_Type}>
              <select
                value={form.Irrigation_Type}
                onChange={(e) => setField("Irrigation_Type", e.target.value)}
                aria-invalid={!!errors.Irrigation_Type}
              >
                <option value="">Select irrigation type</option>
                {IRRIGATION_TYPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            {NUMERIC_FIELDS.map((field) => (
              <Field
                key={field.key}
                label={`${field.label} (${field.unit})`}
                error={errors[field.key]}
                helper={field.helper}
              >
                <input
                  type="number"
                  inputMode="decimal"
                  name={field.key}
                  value={form[field.key]}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  onChange={(e) => setField(field.key, e.target.value)}
                  aria-invalid={!!errors[field.key]}
                />
              </Field>
            ))}
          </div>

          <div className="farm-form__actions">
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="farm-form__spinner" aria-hidden="true" />
                  Analyzing your farm…
                </>
              ) : (
                "Analyze Your Farm"
              )}
            </Button>
            {status === "error" && (
              <p className="farm-form__error" role="alert">
                {farmAnalysis.apiError}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, error, helper, children }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
      {helper && !error && <span className="field__helper">{helper}</span>}
      {error && (
        <span className="field__error" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}
