import React, { useState, useEffect } from "react";
import styles from "./FormItem.module.css";
import axios from "../axios";

function FormMeasure({ onClose, uomData = {}, isEditing = false }) {
  const [formData, setFormData] = useState({ unit: "", abbreviation: "" });
  const [errors, setErrors] = useState({});

  // Autofill when uomData changes
  useEffect(() => {
    setFormData({
      unit: uomData.unit || "",
      abbreviation: uomData.abbreviation || "",
    });
  }, [uomData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.unit.trim()) newErrors.unit = "Required";
    if (!formData.abbreviation.trim()) newErrors.abbreviation = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (isEditing && uomData?.id) {
        await axios.put(`/api/uoms/${uomData.id}`, formData);
      } else {
        await axios.post("/api/uoms", formData);
      }
      onClose(true);
    } catch (err) {
      console.error("Failed to save unit:", err);
      alert("Failed to save unit of measure.");
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.formContainer}>
        <h2 className={styles.header}>{isEditing ? "Edit Unit" : "Add Unit"}</h2>

        <div className={styles.formGroup}>
          <label>
            Unit of Measure<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => handleChange("unit", e.target.value)}
            placeholder="e.g. piece, bottle, kilogram"
          />
          {errors.unit && <small style={{ color: "red" }}>{errors.unit}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>
            Abbreviation<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.abbreviation}
            onChange={(e) => handleChange("abbreviation", e.target.value)}
            placeholder="e.g. pc, btl, kg"
          />
          {errors.abbreviation && <small style={{ color: "red" }}>{errors.abbreviation}</small>}
        </div>

        <div className={styles.actions}>
          <button className={styles.secondary} onClick={() => onClose(false)}>
            Cancel
          </button>
          <button className={styles.primary} onClick={handleSubmit}>
            {isEditing ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormMeasure;