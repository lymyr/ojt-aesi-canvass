import React, { useState } from "react";
import Tabs from "../components/Tabs";
import s from "./NewCanvass.module.css";
import DropdownInput from "../components/DropdownInput";


function NewCanvass() {
  const [items, setItems] = useState([{ id: Date.now(), description: "", typed: "", vendors: [] }]);
  const [vendors, setVendors] = useState([""]);
  const [attachments, setAttachments] = useState([]);
  const [activeTab, setActiveTab] = useState("table");
  const [itemSuggestions, setItemSuggestions] = useState(["item 1", "item 2"]);
  const [vendorSuggestions, setVendorSuggestions] = useState(["vendor 1", "vendor 2"]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setAttachments(selectedFiles); // overwrite or merge depending on use case
  };
   const addItem = () => {
  setItems([...items, { id: Date.now() + Math.random(), description: "", typed: "" }]);
};
  const removeItem = (id) => {
    if (items.length === 1) {
      setItems([{ id: Date.now() + Math.random() }]);
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
    // Reset vendor-related data in items
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        vendors: []
      }))
    );
  } else {
    setVendors((prev) => prev.filter((_, i) => i !== index));
    setItems((prev) =>
      prev.map((item) => {
        const updatedVendors = (item.vendors || []).filter((_, i) => i !== index);
        return {
          ...item,
          vendors: updatedVendors
        };
      })
    );
  }
};

    const updateVendorField = (itemIndex, vendorIndex, field, value) => {
        const updated = [...items];
        const vendors = updated[itemIndex].vendors || [];

        // Ensure vendor row exists
        while (vendors.length <= vendorIndex) {
            vendors.push({ price: "", amount: "", total: 0, stock: "", remarks: "" });
        }

        vendors[vendorIndex][field] = value;

        // Recalculate total
        const price = parseFloat(vendors[vendorIndex].price) || 0;
        const amount = parseFloat(vendors[vendorIndex].amount) || 0;
        vendors[vendorIndex].total = price * amount;

        updated[itemIndex].vendors = vendors;
        setItems(updated);
    };

  return (
    <>
    <div className={s.btnContainer}><button className={s.close}>Close</button> <button className={s.save}>Create</button></div>
        <Tabs
        tabs={["table", "documents"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        />

{activeTab === "table" && (
  <div className={s.tableContainer}>
    <table className={s.table}> 
        {<tbody>
            <tr>
              <td colSpan={3 + vendors.length * 5}>AS OF: {new Date().toLocaleDateString("en-CA")} </td>
            </tr>

            <tr>
              <td colSpan={3}>Items</td>
              {vendors.map((vendor, i) => (
                <td colSpan={5} key={i}>
                  <div>
                    <DropdownInput
  id={`vendor-${i}`}
  placeholder="Enter vendor"
  value={vendor}
  suggestions={vendorSuggestions} // Replace with real vendor list or state
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
  onAdd={(newVendor) => {
  const updated = [...vendors];
  updated[i] = newVendor;
  setVendors(updated);

  if (!vendorSuggestions.includes(newVendor)) {
    setVendorSuggestions((prev) => [...prev, newVendor]);
  }
}}

/>

                    <button onClick={() => removeVendor(i)}>-</button>
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
                  <td>Total</td>
                  <td>Remarks</td>
                </React.Fragment>
              ))}
            </tr>

            {items.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                   <DropdownInput
  id={`items-${item.id}`}
  value={item.typed || item.description}
  placeholder="Enter item"
  suggestions={itemSuggestions}
  onChange={(e) => {
    const value = e.target.value;
    const updated = [...items];
    updated[index].description = value;
    updated[index].typed = value;
    setItems(updated);
  }}
  onBlur={(e) => {
    const updated = [...items];
    updated[index].typed = "";
    setItems(updated);

    if (e.target.value.trim() && index === items.length - 1) {
      addItem();
    }
  }}
  onAdd={(newItem) => {
    // Check if it already exists just in case
    if (!itemSuggestions.includes(newItem)) {
      setItemSuggestions((prev) => [...prev, newItem]);
    }

    const updated = [...items];
    updated[index].description = newItem;
    updated[index].typed = "";
    setItems(updated);
  }}
/>



                    <button onClick={() => removeItem(item.id)}>-</button>
                  </div>
                </td>
                <td>
                  <input type="text" placeholder="Enter amount" />
                </td>
                <td>N/A</td>

                {vendors.map((_, j) => (
                  <React.Fragment key={j}>
                    <td>
  <input
    type="text"
    placeholder="Price"
    value={item.vendors?.[j]?.price || ""}
    onChange={(e) => updateVendorField(index, j, "price", e.target.value)}
  />
</td>
<td>
  <input
    type="text"
    placeholder="Stock"
    value={item.vendors?.[j]?.stock || ""}
    onChange={(e) => updateVendorField(index, j, "stock", e.target.value)}
  />
</td>
<td>
  <input
    type="text"
    placeholder="Amount"
    value={item.vendors?.[j]?.amount || ""}
    onChange={(e) => updateVendorField(index, j, "amount", e.target.value)}
  />
</td>
<td>{item.vendors?.[j]?.total?.toFixed(2) || "0.00"}</td>
<td>
  <input
    type="text"
    placeholder="Remarks"
    value={item.vendors?.[j]?.remarks || ""}
    onChange={(e) => updateVendorField(index, j, "remarks", e.target.value)}
  />
</td>

                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>}
        </table>
      </div> 
    )}

        
{activeTab === "documents" && (
  <div className={s.attach}>
    <input
      type="file"
      multiple
      onChange={handleFileChange}
    />

    {attachments.length > 0 && (
      <ul>
        {attachments.map((file, i) => (
          <li key={i}>{file.name}</li>
        ))}
      </ul>
    )}
  </div>
)}
    </>
  );
}

export default NewCanvass;
