import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import DropdownInput from "./DropdownInput";
import s from "./CanvassForm.module.css";
import FormItem from "./FormItem";
import FormVendor from "./FormVendor";
import axios from "../axios";

const CanvassForm = forwardRef(({ isEditing = false, editClicked = true, initialData=null }, ref) => {
  const [allItemData, setAllItemData] = useState([]);
  const [vendors, setVendors] = useState([""]);
  const [itemSuggestions, setItemSuggestions] = useState([]);
  const [vendorSuggestions, setVendorSuggestions] = useState([]);
  const [showVendorFormIndex, setShowVendorFormIndex] = useState(null);
  const [pendingVendor, setPendingVendor] = useState("");
  const [showItemFormIndex, setShowItemFormIndex] = useState(null);
  const [pendingItem, setPendingItem] = useState("");

  const isReadOnly = isEditing && !editClicked;

  // items initial state (no need to hardcode vendor count)
  const [items, setItems] = useState([
    {
      id: Date.now(),
      description: "",
      uom: "",
      qty_needed: "",
      vendors: vendors, // vendor rows will sync automatically
    },
  ]);


  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      items: items
      .filter(item => item.description.trim() !== "")
      .map((item) => ({
        description: item.description.trim(),
        qty_needed: parseInt(item.qty_needed, 10) || 0,
        vendors: item.vendors.map((v, i) => ({
          vendor_name: vendors[i],
          price: Math.round(parseFloat(v.price) * 100) / 100 || null,
          stock: parseInt(v.stock, 10) || 0,
          amount: parseInt(v.amount, 10) || 0,
          remarks: v.remarks?.trim() === "" ? null : v.remarks,
        })),
      })),
    }),
  }));
  
  useEffect(() => {
    if (!initialData) return;

    const uniqueVendors = [];

    const formattedItems = initialData.items.map(item => {
      const vendorDetails = item.vendors.map(vendor => {
        if (!uniqueVendors.includes(vendor.vendor_name)) {
          uniqueVendors.push(vendor.vendor_name);
        }

        return {
          price: vendor.price,
          stock: vendor.stock,
          amount: vendor.amount,
          remarks: vendor.remarks,
          total: vendor.price * vendor.amount
        };
      });

      return {
        id: Date.now() + Math.random(),
        description: item.description,
        qty_needed: item.qty_needed,
        uom: item.uom || "N/A",
        vendors: vendorDetails,
      };
    });

    setItems(formattedItems);
    setVendors(uniqueVendors);

    if (isEditing && editClicked) {
      formattedItems.push({
        id: Date.now() + Math.random(),
        description: "",
        uom: "",
        qty_needed: "",
        vendors: [],
      });
    }
    
    if (isEditing && editClicked && uniqueVendors.length > 0) {
      uniqueVendors.push("");
    }
  }, [initialData, isEditing, editClicked]);

  const fetchVendors = async () => {
    const res = await axios.get("/api/vendors");
    setVendorSuggestions(res.data.map(v => v.name));
    return res.data;
  };

  const fetchItems = async () => {
    const res = await axios.get("/api/items");
    setAllItemData(res.data);
    setItemSuggestions(res.data.map(i => i.description));
    return res.data;
  };

  const fetchLatestQuote = async (itemDesc, vendorName) => {
    try {
      const res = await axios.get("/api/canvass/last-quote", {
        params: { item: itemDesc, vendor: vendorName },
      });
      return res.data.price ?? "";
    } catch (err) {
      console.error("Failed to fetch latest quote:", err);
      return "";
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

  const handleVendorFormClose = async () => {
    setShowVendorFormIndex(null);
    await fetchVendors();
    setPendingVendor("");
  };

  const handleMissingVendor = (index, val) => {
    setPendingVendor(val);
    setShowVendorFormIndex(index);
  };

  const handleItemFormClose = async () => {
    setShowItemFormIndex(null);
    const updatedItems = await fetchItems();
    setPendingItem("");

    const matched = updatedItems.find(i => i.description === pendingItem);

    if (matched && showItemFormIndex !== null) {
      setItems(prev => {
        const copy = [...prev];
        copy[showItemFormIndex].description = matched.description;
        copy[showItemFormIndex].uom = matched.uom?.abbreviation || "N/A";
        return copy;
      });
    }
  };

  const handleMissingItem = (index, val) => {
    setPendingItem(val);
    setShowItemFormIndex(index);
  };

  const addItem = () => {
    const currentVendors = vendors.filter(v => v.trim() !== "").map(() => ({
      price: "",
      amount: "",
      stock: "",
      remarks: "",
      total: 0,
    }));

    setItems((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), description: "", vendors: currentVendors },
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

  useEffect(() => {
    fetchItems();
    fetchVendors();
  }, []);

  // 💡 Auto-fill unit price when item + vendor are both selected
  useEffect(() => {
    items.forEach((item, itemIndex) => {
      vendors.forEach(async (vendorName, vendorIndex) => {
        const vendorData = item.vendors?.[vendorIndex] || {};
        if (
          item.description?.trim() &&
          vendorName?.trim() &&
          !vendorData.price
        ) {
          const price = await fetchLatestQuote(item.description.trim(), vendorName.trim());
          if (price !== "") {
            updateVendorField(itemIndex, vendorIndex, "price", price);
          }
        }
      });
    });
  }, [items, vendors]);

  useEffect(() => {
  const filteredVendors = vendors.filter(v => v && v.trim() !== ""); // ✅ correct filtering

  setItems(prevItems => {
    return prevItems.map(item => {
      const updatedVendors = [...item.vendors];

      while (updatedVendors.length < filteredVendors.length) {
        updatedVendors.push({
          price: "",
          amount: "",
          stock: "",
          remarks: "",
          total: 0,
        });
      }

      if (updatedVendors.length > filteredVendors.length) {
        updatedVendors.length = filteredVendors.length;
      }

      return { ...item, vendors: updatedVendors };
    });
  });
}, [vendors]);



  
  return (
    <>
      <div className={s.masterContainer}>
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
                            updated[index].uom = itemMatch?.uom?.abbreviation || "N/A";
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
                        value={item.qty_needed || ""}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[index].qty_needed = e.target.value;
                          setItems(updated);
                        }}
                        disabled={isReadOnly || isRowDisabled}
                      />
                    </td>
                    <td>{item.uom || ""}</td>
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
          {/* <button className={s.addBtn}>+</button> */}
        </div>
        {/* <button className={s.addBtn}>+</button> */}
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
});

export default CanvassForm;
