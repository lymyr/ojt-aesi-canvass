import React, { useState, useEffect } from "react";
import DropdownInput from "./DropdownInput";
import s from "./CanvassForm.module.css";
import FormItem from "./FormItem";
import FormVendor from "./FormVendor";
import axios from "../axios";

function CanvassForm({ isEditing = false, editClicked = true }) {
  const [items, setItems] = useState([
    { id: Date.now(), description: "", uom: "", vendors: [] },
  ]);
  const [allItemData, setAllItemData] = useState([]);

  const [vendors, setVendors] = useState([""]);
  const [itemSuggestions, setItemSuggestions] = useState([]);
  const [vendorSuggestions, setVendorSuggestions] = useState([]);

  const [showVendorFormIndex, setShowVendorFormIndex] = useState(null);
  const [pendingVendor, setPendingVendor] = useState("");

  const [showItemFormIndex, setShowItemFormIndex] = useState(null);
  const [pendingItem, setPendingItem] = useState("");

  const handleMissingVendor = (index, val) => {
    setPendingVendor(val);
    setShowVendorFormIndex(index);
  };

  const fetchVendors = async () => {
    const res = await axios.get("/api/vendors");
    setVendorSuggestions(res.data.map(v => v.name));
    return res.data;
  };

  const handleVendorFormClose = async () => {
    setShowVendorFormIndex(null);
    await fetchVendors(); // refresh vendor suggestions only
    setPendingVendor("");
  };

  const handleMissingItem = (index, val) => {
    setPendingItem(val);
    setShowItemFormIndex(index);
  };

  const fetchItems = async () => {
    const res = await axios.get("/api/items");
    setAllItemData(res.data); // full item objects
    setItemSuggestions(res.data.map(i => i.description)); // still needed for dropdown
    return res.data;
  };
  const handleItemFormClose = async () => {
    setShowItemFormIndex(null);
    await fetchItems(); // refresh suggestions only
    setPendingItem(""); // clear previous search
  };

  useEffect(() => {
    fetchItems();
    fetchVendors();
  }, []);

  const isReadOnly = isEditing && !editClicked;

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), description: "", vendors: [] },
    ]);
  };

  const removeItem = (id) => {
    if (items.length === 1) {
      setItems([{ id: Date.now() + Math.random(), description: "", vendors: [] }]);
    } else {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const addVendor = () => {
    setVendors((prev) => [...prev, ""]);
  };

  const removeVendor = (index) => {
    if (vendors.length === 1) {
      setVendors([""]);
      setItems((prev) =>
        prev.map((item) => ({ ...item, vendors: [] }))
      );
    } else {
      setVendors((prev) => prev.filter((_, i) => i !== index));
      setItems((prev) =>
        prev.map((item) => {
          const updatedVendors = (item.vendors || []).filter((_, i) => i !== index);
          return { ...item, vendors: updatedVendors };
        })
      );
    }
  };

  const updateVendorField = (itemIndex, vendorIndex, field, value) => {
    const updated = [...items];
    const vendors = updated[itemIndex].vendors || [];

    while (vendors.length <= vendorIndex) {
      vendors.push({ price: "", amount: "", total: "", stock: "", remarks: "" });
    }

    vendors[vendorIndex][field] = value;

    const price = parseFloat(vendors[vendorIndex].price) || 0;
    const amount = parseFloat(vendors[vendorIndex].amount) || 0;
    vendors[vendorIndex].total = price * amount;

    updated[itemIndex].vendors = vendors;
    setItems(updated);
  };

  return (
    <>
    <div className={s.tableContainer}>
      <table className={s.table}>
        <tbody>
          <tr>
            <td colSpan={3 + vendors.length * 5}>
              AS OF: {new Date().toLocaleDateString("en-CA")}
            </td>
          </tr>

          <tr>
            <td colSpan={3}>Items</td>
            {vendors.map((vendor, i) => (
              <td colSpan={5} key={i}>
                <div>
                  <DropdownInput
                    id={`vendor-${i}`}
                    value={vendor}
                    suggestions={vendorSuggestions}
                    placeholder={"Add Vendor"}
                    onChange={(e) => {
                      const updated = [...vendors];
                      updated[i] = e.target.value;
                      setVendors(updated);
                    }}
                    onBlur={(e) => {
                      if (e.target.value.trim() && i === vendors.length - 1) {
                        addVendor();
                      }
                    }}
                    onMissingValue={(newVendor) => {
                      handleMissingVendor(i, newVendor);
                    }}
                    disabled={isReadOnly}
                  />
                  {!isReadOnly && <button onClick={() => removeVendor(i)}>X</button>}
                </div>
              </td>
            ))}
          </tr>

          <tr>
            <td>Description</td>
            <td>Needed Amount</td>
            <td>UoM</td>
            {vendors.map((_, i) => (
              <React.Fragment key={i}>
                <td>Unit Price</td>
                <td>Stock</td>
                <td>Order Amount</td>
                <td>Remarks</td>
                <td>Total</td>
              </React.Fragment>
            ))}
          </tr>

          {items.map((item, index) => {
  const isRowDisabled = !item.description.trim();

  return (
    <tr key={item.id}>
      <td>
        <div>
          <DropdownInput
            id={`items-${item.id}`}
            value={item.description}
            suggestions={itemSuggestions}
            placeholder={"Add Item"}
            onChange={(e) => {
              const value = e.target.value;
              const itemMatch = allItemData.find(i => i.description === value);
              const updated = [...items];
              updated[index].description = value;
              updated[index].uom = itemMatch?.uom?.abbreviation || "N/A"; // 👈 set abbreviation
              setItems(updated);
            }}
            onBlur={(e) => {
              const updated = [...items];
              setItems(updated);

              if (e.target.value.trim() && index === items.length - 1) {
                addItem();
              }
            }}
            onMissingValue={(newItem) => {
              handleMissingItem(index, newItem);
            }}
            disabled={isReadOnly}
          />
          {!isReadOnly && <button onClick={() => removeItem(item.id)}>X</button>}
        </div>
      </td>

      <td>
        <input
          type="number"
          min="0"
          step="1"
          disabled={isReadOnly || isRowDisabled}
        />
      </td>

      <td>{item.uom || "" }</td>

      {vendors.map((_, j) => {
        const vendorData = item.vendors?.[j] || {};
        const isVendorEmpty = !vendors[j]?.trim();
        const disableInput = isReadOnly || isRowDisabled || isVendorEmpty;

        return (
          <React.Fragment key={j}>
            <td>
              <input
                type="number"
                min="0"
                value={vendorData.price || ""}
                onChange={(e) => updateVendorField(index, j, "price", e.target.value)}
                disabled={disableInput}
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                step="1"
                value={vendorData.stock || ""}
                onChange={(e) => updateVendorField(index, j, "stock", e.target.value)}
                disabled={disableInput}
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                step="1"
                value={vendorData.amount || ""}
                onChange={(e) => updateVendorField(index, j, "amount", e.target.value)}
                disabled={disableInput}
              />
            </td>
            <td>
              <input
                type="text"
                value={vendorData.remarks || ""}
                onChange={(e) => updateVendorField(index, j, "remarks", e.target.value)}
                disabled={disableInput}
              />
            </td>
            <td>
              {Number(vendorData.total || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
          </React.Fragment>
        );
      })}

    </tr>
  );
})}

        </tbody>
      </table>
    </div>

    {showVendorFormIndex !== null && (
      <FormVendor
        vendorData={{ name: pendingVendor }}
        onClose={handleVendorFormClose}
      />
    )}

    {showItemFormIndex !== null && (
      <FormItem
        itemData={{ description: pendingItem }}
        onClose={handleItemFormClose}
      />
    )}
    </>
  );
}

export default CanvassForm;
