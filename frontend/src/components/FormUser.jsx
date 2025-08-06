import React, { useState, useEffect } from "react";
import styles from "./FormItem.module.css"; // shared styles
import axios from "../axios";

function FormUser({ onClose, userData = {}, isEditing = false, refreshUsers }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    isApprover: false,
  });

  useEffect(() => {
    setFormData({
      username: userData.username || "",
      password: "",
      isApprover: userData.isApprover || false,
    });
  }, [userData]);

  const [isEditMode, setIsEditMode] = useState(!isEditing);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Required";
    if (!isEditing && !formData.password.trim()) newErrors.password = "Required"; // only require password on create
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await axios.post("/api/users", formData);
      refreshUsers?.(); // call parent refresh if provided
      onClose(); // close modal
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save user";
      alert(msg);
      console.error("Save error:", err);
    }
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
            placeholder="Enter a unique username"
          />
          {errors.username && <small style={{ color: "red" }}>{errors.username}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>
            Password{!isEditing && <span className={styles.required}>*</span>}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            disabled={!isEditMode}
            placeholder="Enter your password"
          />
          {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}
        </div>

        <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
          <input
            type="checkbox"
            checked={formData.isApprover}
            onChange={(e) => handleChange("isApprover", e.target.checked)}
            disabled={!isEditMode}
            id="checkbox"
          />
          <label htmlFor="checkbox">Approver</label>
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