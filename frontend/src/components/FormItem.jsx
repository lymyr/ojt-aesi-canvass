import React, { useState, useEffect } from "react";
import axios from "../axios";
import styles from "./FormItem.module.css";
import DropdownInput from "./DropdownInput";
import FormMeasure from "./FormMeasure";

function FormItem({ isEditing = false, onClose, itemData = {}, onSuccess }) {
  const safeItem = itemData || {};
  const [formData, setFormData] = useState({
    description: safeItem.description || "",
    unit: safeItem.uom?.unit || "",
    unit_id: safeItem.unit_id || null,
    remarks: safeItem.remarks || "",
  });

  useEffect(() => {
    const safeItem = itemData || {};
    setFormData({
      description: safeItem.description || "",
      unit: safeItem.uom?.unit || "",
      unit_id: safeItem.unit_id || null,
      remarks: safeItem.remarks || "",
    });
  }, [itemData?.id]);



  const [isEditMode, setIsEditMode] = useState(!isEditing);
  const [errors, setErrors] = useState({});
  const [uomSuggestions, setUomSuggestions] = useState([]);
  const [uomList, setUomList] = useState([]);

  const [showUomForm, setShowUomForm] = useState(false);
  const [pendingUom, setPendingUom] = useState("");

  const fetchUOMs = async () => {
    try {
      const res = await axios.get("/api/uoms");
    const data = res.data?.data ?? [];
    setUomList(data);
    setUomSuggestions(data.map((u) => u.unit));
    return data;
    } catch (err) {
      console.error("Failed to load UOMs:", err);
      return [];
    }
  };



  useEffect(() => {
    fetchUOMs();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "unit") {
        const match = uomList.find((u) => u.unit.toLowerCase() === value.toLowerCase());
        updated.unit_id = match ? match.id : null;
      }

      return updated;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = "Required";
    if (!formData.unit.trim()) newErrors.unit = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setErrors({});
    if (showUomForm) {
      alert("Please finish adding the Unit of Measure first.");
      return;
    }
    if (!validate()) return;
    try {
      if (!formData.unit_id) {
        alert("Please select a valid Unit of Measure.");
        return;
      }
      if (isEditing) {
        const res = await axios.put(`/api/items/${itemData.id}`, formData);
        if (onSuccess) onSuccess(res.data);
      } else {
        const res = await axios.post("/api/items", formData);
        if (onSuccess) onSuccess(res.data);
      }
      onClose();
    } catch (err) {
      console.error("Error saving item:", err);
      alert("Failed to save item.");
    }
  };


  const handleMissingUOM = (val) => {
    setPendingUom(val);
    setShowUomForm(true);
  };

  const handleUomFormClose = async (didAdd) => {
    setShowUomForm(false);
    if (didAdd) {
      const updatedUOMs = await fetchUOMs();
      const match = updatedUOMs.find((u) => u.unit.toLowerCase() === pendingUom.toLowerCase());

      setFormData((prev) => ({
        ...prev,
        unit: pendingUom,
        unit_id: match ? match.id : null,
      }));
    }
    setPendingUom("");
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
            placeholder="e.g. Menthol Crystals, Amber Bottle"
          />
          {errors.description && (
            <small style={{ color: "red" }}>{errors.description}</small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>
            Unit of Measure<span className={styles.required}>*</span>
          </label>
          <DropdownInput
            id="uom-list"
            placeholder="e.g. piece, bottle, kilogram"
            value={formData.unit}
            onChange={(e) => handleChange("unit", e.target.value)}
            suggestions={uomSuggestions}
            disabled={!isEditMode}
            onMissingValue={handleMissingUOM}
          />
          {errors.unit && (
            <small style={{ color: "red" }}>{errors.unit}</small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Remarks (optional)</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
            disabled={!isEditMode}
            placeholder="e.g. For promo use only, needed for trial production"
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

      {/* UOM Popup */}
      {showUomForm && (
        <FormMeasure
          onClose={handleUomFormClose}
          uomData={{ unit: pendingUom }}
        />
      )}
    </div>
  );
}

export default FormItem;