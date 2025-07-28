import React, { useState } from "react";
import styles from "./FormItem.module.css";

function FormMeasure({
  isEditing = false,
  onClose,
  onSave, // Callback with the data
  measureData = {}, // { unit, abbreviation }
}) {
  const [formData, setFormData] = useState({
    unit: measureData.unit || "",
    abbreviation: measureData.abbreviation || "",
  });

  const [isEditMode, setIsEditMode] = useState(!isEditing);
  const [errors, setErrors] = useState({});

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

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.formContainer}>
        <h2 className={styles.header}>
          {!isEditing ? "Add Unit" : isEditMode ? "Edit Unit" : "View Unit"}
        </h2>

        <div className={styles.formGroup}>
          <label>
            Unit of Measure<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => handleChange("unit", e.target.value)}
            disabled={!isEditMode}
            placeholder="Enter unit of measure"
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
            disabled={!isEditMode}
            placeholder="Enter abbreviation"
          />
          {errors.abbreviation && <small style={{ color: "red" }}>{errors.abbreviation}</small>}
        </div>

        <div className={styles.actions}>
          <button className={styles.secondary} onClick={onClose}>
            {isEditing && isEditMode ? "Cancel" : "Close"}
          </button>

          {!isEditing ? (
            <button className={styles.primary} onClick={handleSubmit}>Add</button>
          ) : isEditMode ? (
            <button className={styles.primary} onClick={handleSubmit}>Save</button>
          ) : (
            <button className={styles.primary} onClick={() => setIsEditMode(true)}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FormMeasure;