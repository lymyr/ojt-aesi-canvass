import React, { useState } from "react";
import styles from "./FormItem.module.css"; // shared styles

function FormUser({ onClose, onSave, userData = {}, isEditing = false }) {
  const [formData, setFormData] = useState({
    username: userData.username || "",
    password: userData.password || "",
    isApprover: userData.isApprover || false,
  });

  const [isEditMode, setIsEditMode] = useState(!isEditing);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Required";
    if (!formData.password.trim()) newErrors.password = "Required";
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
          {!isEditing ? "Add User" : isEditMode ? "Edit User" : "View User"}
        </h2>

        <div className={styles.formGroup}>
          <label>
            Username<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            disabled={!isEditMode}
            placeholder="Enter username"
          />
          {errors.username && <small style={{ color: "red" }}>{errors.username}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>
            Password<span className={styles.required}>*</span>
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            disabled={!isEditMode}
            placeholder="Enter password"
          />
          {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}
        </div>

        <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
            <input
              type="checkbox"
              checked={formData.isApprover}
              onChange={(e) => handleChange("isApprover", e.target.checked)}
              disabled={!isEditMode}
              id={styles.checkbox}
            />
            <label for={styles.checkbox}>Approver</label>
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

export default FormUser;