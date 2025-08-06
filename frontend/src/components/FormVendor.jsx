import { useState, useEffect } from "react";
import styles from "./FormItem.module.css";
import axios from "../axios";

function FormVendor({ isEditing = false, onClose, vendorData = {} }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    tin: "",
    remarks: "",
  });

  useEffect(() => {
    setFormData({
      id: vendorData.id || null,
      name: vendorData.name || "",
      address: vendorData.address || "",
      tin: vendorData.tin || "",
      remarks: vendorData.remarks || "",
      active: vendorData.active ?? 1
    });
  }, [vendorData]);

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

  const handleSubmit = async () => {
    if (!validate()) return;
      try {
      const payload = {
        name: formData.name,
        address: formData.address,
        tin: formData.tin,
        remarks: formData.remarks,
        active: formData.active,
      };

      if (isEditing && formData.id) {
        console.log("updating");
        await axios.put(`/api/vendors/${formData.id}`, payload);
      } else {
        console.log("creating");
        await axios.post("/api/vendors", { ...payload, active: true });
      }

      onClose();
    } catch (err) {
      console.error("Failed to save vendor:", err);
      alert("Error saving vendor.");
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

        {isEditing && (
          <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
            <input
              type="checkbox"
              checked={formData.active === 1}
              onChange={(e) => handleChange("active", e.target.checked ? 1 : 0)}
              disabled={!isEditMode}
              id="checkbox"
            />
            <label htmlFor="checkbox">Active</label>
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.secondary} onClick={onClose}>
            {isEditing && isEditMode ? "Cancel" : "Close"}
          </button>

          {!isEditing ? (
            <button className={styles.primary} onClick={handleSubmit}>
              Add
            </button>
          ) : isEditMode ? (
            <button className={styles.primary} onClick={handleSubmit}>
              Save
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