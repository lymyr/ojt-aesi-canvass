import React from "react";
import s from "./PdfView.module.css";

function PdfView({ canvassData, id, ref }) {
  if (!canvassData || !canvassData.items || canvassData.items.length === 0) {
    return <p>No data available</p>;
  }

  // Group items by vendor_id
  const vendorGroups = {};
  canvassData.items.forEach(item => {
    item.vendors.forEach(vendor => {
      if (vendor.amount > 0) { // Only include if order amount > 0
        if (!vendorGroups[vendor.vendor_id]) {
          vendorGroups[vendor.vendor_id] = {
            vendorName: vendor.vendor_name,
            items: []
          };
        }
        vendorGroups[vendor.vendor_id].items.push({
          description: item.description,
          qty_needed: item.qty_needed,
          uom: item.uom,
          ...vendor
        });
      }
    });
  });

  return (
    <div ref={ref} className={s.container}>
      <h2>Canvass Sheet #{id}</h2>
      <p>AS OF: {new Date(canvassData.updated_at).toLocaleDateString("en-CA")}</p>

      {Object.values(vendorGroups).map((vendorData, idx) => (
        <div key={idx} className={s.section}>
          <table className={s.table}>
            <thead>
              <tr>
                <th colSpan={8}>{vendorData.vendorName}</th>
              </tr>
            </thead>
            <tbody>
               <tr>
                <td>Item</td>
                <td>Quantity Needed</td>
                <td>UOM</td>
                <td>Unit Price</td>
                <td>Stock</td>
                <td>Order Amount</td>
                <td>Remarks</td>
                <td>Total</td>
              </tr>
              {vendorData.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.description || "N/A"}</td>
                  <td className={s.num}>{item.qty_needed || 0}</td>
                  <td>{item.uom || "N/A"}</td>
                  <td className={s.num}>{formatPrice(item.price)}</td>
                  <td className={s.num}>{item.stock ?? 0}</td>
                  <td className={s.num}>{item.amount ?? 0}</td>
                  <td>{item.remarks ?? ""}</td>
                  <td className={s.num}>
                    {formatPrice((item.price || 0) * (item.amount || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// Helper function
const formatPrice = (value) => {
  const num = parseFloat(value);
  return isNaN(num)
    ? ""
    : num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
};

export default PdfView;
