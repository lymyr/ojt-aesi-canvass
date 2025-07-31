import React, { useState } from "react";
import styles from "./FormItem.module.css";
import axios from "../axios";

function FormVendor({ isEditing = false, onClose, vendorData = {} }) {
  const [formData, setFormData] = useState({
    name: vendorData.name || "",
    address: vendorData.address || "",
    tin: vendorData.tin || "",
    remarks: vendorData.remarks || "",
  });

  const [isEditMode, setIsEditMode] = useState(!isEditing);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      await axios.post("/api/vendors", {
        ...formData,
        active: true, // default to active
      });
      onClose(); // Close popup after saving
    } catch (error) {
      console.error("Error saving vendor:", error);
      alert("Failed to save vendor.");
    } finally {
      setSaving(false);
    }
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
            placeholder="e.g. GreenLeaf Herbals"
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
            placeholder="e.g. 45 Herbal Rd., San Juan, Metro Manila"
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
            placeholder="e.g. 123-456-789"
          />
          {errors.tin && <small style={{ color: "red" }}>{errors.tin}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Remarks (optional)</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
            disabled={!isEditMode}
            placeholder="e.g. Fast delivery, bulk discount, limited stock"
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.secondary} onClick={onClose}>
            {isEditing && isEditMode ? "Cancel" : "Close"}
          </button>

          {!isEditing ? (
            <button className={styles.primary} onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Add"}
            </button>
          ) : isEditMode ? (
            <button className={styles.primary} onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          ) : (
            <button className={styles.primary} onClick={() => setIsEditMode(true)}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FormVendor;