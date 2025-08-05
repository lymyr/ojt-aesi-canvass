import React from "react";
import s from "./PdfView.module.css";

function PdfView({ canvassData, id, ref }) {
  if (!canvassData || !canvassData.items || canvassData.items.length === 0) {
    return <p>No data available</p>;
  }

  const vendorCount = canvassData.items[0].vendors.length;

  return (
    <div ref={ref} className={s.container}>
      <h2>Canvass Sheet #{id}</h2>
      <p>AS OF: {new Date(canvassData.updated_at).toLocaleDateString("en-CA")}</p>

      {Array.from({ length: vendorCount }).map((_, vendorIndex) => {
        const vendorName =
          canvassData.items[0].vendors[vendorIndex]?.vendor_name ||
          `Vendor ${vendorIndex + 1}`;

        return (
          <div key={vendorIndex} className={s.section}>
            <table className={s.table}>
              <thead>
                <tr>
                    <th colSpan={8}>{vendorName}</th>
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
                {canvassData.items.map((item, itemIndex) => {
                  const vendor = item.vendors[vendorIndex] || {};
                  if (vendor.amount > 0) {
                    return (
                        <tr key={itemIndex}>
                        <td>{item.description || "N/A"}</td>
                        <td className={s.num}>{item.qty_needed || 0}</td>
                        <td>{item.uom || "N/A"}</td>
                        <td className={s.num}>{formatPrice(vendor.price)}</td>
                        <td className={s.num}>{vendor.stock ?? 0}</td>
                        <td className={s.num}>{vendor.amount ?? 0}</td>
                        <td>{vendor.remarks ?? ""}</td>
                        <td className={s.num}>{formatPrice(vendor.price * vendor.amount)}</td>
                        </tr>
                    );
                    }
                })}
              </tbody>
            </table>
          </div>
        );
      })}
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