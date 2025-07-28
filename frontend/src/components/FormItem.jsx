import React, { useState } from "react";
import styles from "./FormItem.module.css";
import DropdownInput from "./DropdownInput";

function FormItem({
  isEditing = false,
  onClose,
  onSave,  // Callback with the data
  itemData = {}, // { description, unit, remarks }
}) {
  const [formData, setFormData] = useState({
    description: itemData.description || "",
    unit: itemData.unit || "",
    remarks: itemData.remarks || "",
  });

  const [isEditMode, setIsEditMode] = useState(!isEditing);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = "Required";
    if (!formData.unit.trim()) newErrors.unit = "Required";
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
          {!isEditing ? "Add Item" : isEditMode ? "Edit Item" : "View Item"}
        </h2>

        <div className={styles.formGroup}>
          <label>
            Item Description<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            disabled={!isEditMode}
            placeholder="Enter item"
          />
          {errors.description && <small style={{ color: "red" }}>{errors.description}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>
            Unit of Measure<span className={styles.required}>*</span>
          </label>
          <DropdownInput
            placeholder={"Enter unit of measure"}
            suggestions={["kilogram", "liter", "pack"]}
            disabled={!isEditMode}
          />
          {errors.unit && <small style={{ color: "red" }}>{errors.unit}</small>}
        </div>


        <div className={styles.formGroup}>
          <label>Remarks (optional)</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
            disabled={!isEditMode}
            placeholder="Enter remarks"
          />
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

export default FormItem;
