import React, { useState } from "react";
import styles from "./FormItem.module.css";

function FormVendor({ isEditing = false, onClose, onSave, vendorData = {} }) {
  const [formData, setFormData] = useState({
    name: vendorData.name || "",
    address: vendorData.address || "",
    tin: vendorData.tin || "",
    remarks: vendorData.remarks || "",
  });

  const [isEditMode, setIsEditMode] = useState(!isEditing);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Required";
    if (!formData.address.trim()) newErrors.address = "Required";
    if (!formData.tin.trim()) newErrors.tin = "Required";
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
          {!isEditing ? "Add Vendor" : isEditMode ? "Edit Vendor" : "View Vendor"}
        </h2>

        <div className={styles.formGroup}>
          <label>
            Vendor Name<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            disabled={!isEditMode}
            placeholder="Enter vendor name"
          />
          {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>
            Address<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            disabled={!isEditMode}
            placeholder="Enter address"
          />
          {errors.address && <small style={{ color: "red" }}>{errors.address}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>
            TIN<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.tin}
            onChange={(e) => handleChange("tin", e.target.value)}
            disabled={!isEditMode}
            placeholder="Enter TIN"
          />
          {errors.tin && <small style={{ color: "red" }}>{errors.tin}</small>}
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

export default FormVendor;