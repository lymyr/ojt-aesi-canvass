import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import DropdownInput from "./DropdownInput";
import s from "./CanvassForm.module.css";
import FormItem from "./FormItem";
import FormVendor from "./FormVendor";
import axios from "../axios";

const CanvassForm = forwardRef(({ isEditing = false, editClicked = true, initialData=null }, ref) => {
  const [allItemData, setAllItemData] = useState([]);
  const [allVendorData, setAllVendorData] = useState([]);
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
      item_id: null,
      description: "",
      uom: "",
      qty_needed: "",
      vendors: vendors, // vendor rows will sync automatically
    },
  ]);


  useImperativeHandle(ref, () => ({
  getFormData: () => {
    console.log("🔍 Starting getFormData...");
    const processedItems = items
      .filter(item => {
        const isValid = !!item.item_id;
        if (!isValid) console.warn("⚠️ Skipping item with missing item_id:", item);
        return isValid;
      })
      .map((item, itemIndex) => {
        console.log(`📦 Processing item #${itemIndex + 1}:`, item);
        const processedVendors = item.vendors
          .filter((v, vendorIndex) => {
            const isValidPrice = typeof v.price === "string" && v.price.trim() !== "" && !isNaN(parseFloat(v.price));
            const isValidStock = typeof v.stock === "string" && v.stock.trim() !== "" && !isNaN(parseInt(v.stock, 10));
            const isValidAmount = typeof v.amount === "string" && v.amount.trim() !== "" && !isNaN(parseInt(v.amount, 10));
            const isValidRemarks = typeof v.remarks === "string" && v.remarks.trim() !== "";

            const hasMeaningfulInput = isValidPrice || isValidStock || isValidAmount || isValidRemarks;
            const isValidVendor = v.vendor_id && hasMeaningfulInput;

            if (!isValidVendor) {
              console.warn(`⚠️ Skipping vendor #${vendorIndex + 1} for item_id ${item.item_id}:`, v);
            }

            return isValidVendor;
          })
          .map((v, vendorIndex) => {
            const parsed = {
              vendor_id: v.vendor_id,
              price: parseFloat(v.price) || null,
              stock: parseInt(v.stock, 10) || 0,
              amount: parseInt(v.amount, 10) || 0,
              remarks: v.remarks?.trim() === "" ? null : v.remarks,
            };
            console.log(`✅ Vendor #${vendorIndex + 1} for item_id ${item.item_id}:`, parsed);
            return parsed;
          });

        return {
          item_id: item.item_id,
          qty_needed: parseInt(item.qty_needed, 10) || 0,
          vendors: processedVendors,
        };
      });

    console.log("✅ Final processed form data:", processedItems);
    return { items: processedItems };
  },
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
        item_id: item.item_id ?? null, // ✅ restore item_id
        description: item.description,
        qty_needed: item.qty_needed,
        uom: item.uom || "N/A",
        vendors: item.vendors.map(v => ({
          vendor_id: v.vendor_id ?? null, // ✅ restore vendor_id
          price: v.price ?? "",
          stock: v.stock ?? "",
          amount: v.amount ?? "",
          remarks: v.remarks ?? "",
          total: Math.ceil((parseFloat(v.price || 0) * parseFloat(v.amount || 0)) * 100) / 100,
        })),
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
    setAllVendorData(res.data);
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
      vendors.push({ vendor_id: null, price: "", amount: "", total: "", stock: "", remarks: "" });
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
    const latestVendors = await fetchVendors();
    setPendingVendor("");

    setItems(prevItems => {
      return prevItems.map(item => {
        const updatedVendors = [...item.vendors];
        for (let i = 0; i < vendors.length; i++) {
          const name = vendors[i]?.trim();
          const found = latestVendors.find(v => v.name === name);
          if (!updatedVendors[i]) {
            updatedVendors[i] = {};
          }
          updatedVendors[i].vendor_id = found?.id || null;
        }
        return { ...item, vendors: updatedVendors };
      });
    });
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
        copy[showItemFormIndex].item_id = matched.id;
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
    const currentVendors = vendors.filter(v => v.trim() !== "").map(vendorName => {
      const match = allVendorData.find(v => v.name === vendorName);
      return {
        vendor_id: match?.id || null,
        price: "",
        amount: "",
        stock: "",
        remarks: "",
        total: 0,
      };
    });

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

  useEffect(() => {
  const filteredVendors = vendors.filter(v => v && v.trim() !== ""); // ✅ correct filtering

  setItems(prevItems => {
    return prevItems.map(item => {
      const updatedVendors = [...(item.vendors || [])];

      while (updatedVendors.length < filteredVendors.length) {
        const vendorName = filteredVendors[updatedVendors.length];
        const match = allVendorData.find(v => v.name === vendorName);

        updatedVendors.push({
          vendor_id: match?.id || null,
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

      // 🔁 Update vendor_ids again in case vendor name changed
      updatedVendors.forEach((v, i) => {
        const vendorName = filteredVendors[i];
        const match = allVendorData.find(v => v.name === vendorName);
        v.vendor_id = match?.id || null;
      });

      return { ...item, vendors: updatedVendors };
    });
  });
}, [vendors, allVendorData]); // <-- make sure `allVendorData` is in the dependency list



  
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
                          const vendorMatch = allVendorData.find(v => v.name === e.target.value);
                          const updatedItems = [...items];
                          updatedItems.forEach((item) => {
                            if (!item.vendors[i]) {
                              item.vendors[i] = {};
                            }
                            item.vendors[i].vendor_id = vendorMatch?.id || null; // 👈 store vendor_id
                          });
                          setItems(updatedItems);
                        }}
                        onBlur={async (e) => {
                          if (e.target.value.trim() && i === vendors.length - 1) {
                            addVendor();
                          }

                          // Autofill prices for all items when vendor is unfocused
                          const vendorName = e.target.value.trim();
                          if (vendorName) {
                            for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                              const itemDesc = items[itemIndex].description?.trim();
                              if (itemDesc) {
                                const price = await fetchLatestQuote(itemDesc, vendorName);
                                updateVendorField(itemIndex, i, "price", price);
                              }
                            }
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
                            updated[index].item_id = itemMatch?.id || null;
                            updated[index].description = value;
                            updated[index].uom = itemMatch?.uom?.abbreviation || "N/A";
                            setItems(updated);
                          }}
                         onBlur={async (e) => {
                            const itemDesc = e.target.value.trim();
                            if (itemDesc) {
                              const vendorUpdates = [];
                              for (let j = 0; j < vendors.length; j++) {
                                const vendorName = vendors[j]?.trim();
                                if (vendorName) {
                                  const price = await fetchLatestQuote(itemDesc, vendorName);
                                  vendorUpdates.push({ index: j, price });
                                }
                              }
                              setItems((prevItems) => {
                                const updated = [...prevItems];
                                const vendors = updated[index].vendors || [];
                                while (vendors.length < vendorUpdates.length) {
                                  vendors.push({vendor_id: null, price: "", amount: "", stock: "", remarks: "", total: 0 });
                                }
                                vendorUpdates.forEach(({ index: vendorIdx, price }) => {
                                  vendors[vendorIdx].price = price;
                                  const amount = parseFloat(vendors[vendorIdx].amount) || 0;
                                  vendors[vendorIdx].total = price * amount;
                                });
                                updated[index].vendors = vendors;
                                return updated;
                              });
                            }
                            if (itemDesc && index === items.length - 1) {
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
