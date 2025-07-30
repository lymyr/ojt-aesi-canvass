import { useEffect, useState } from "react";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import FormVendor from "../components/FormVendor";
import s from "./listActions.module.css";
import axios from "../axios"; // 👈 Import shared Axios instance

function ListVendor({ setTitle }) {
  const [showPopup, setShowPopup] = useState(false);
  const [vendors, setVendors] = useState([]); // Store vendors list

  // Set page title and fetch initial vendors list
  useEffect(() => {
    setTitle("Vendors List");

    axios.get("/api/vendors")
      .then((res) => {
        setVendors(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch vendors:", err);
      });
  }, [setTitle]);

  return (
    <div className={s.container}>
      <div className={s.listActions}>
        <Search />
        <button onClick={() => setShowPopup(true)}>Add Vendor</button>
      </div>

      <ListView
        columns={["ID", "Vendor Name", "Address", "TIN", "Remarks", "Active"]}
        rows={vendors.map((v) => ({
          ID: v.id,
          "Vendor Name": v.name,
          Address: v.address,
          TIN: v.tin,
          Remarks: v.remarks || "",
          Active: v.active ? "Yes" : "No",
        }))}
      />

      <Paginate />

      {showPopup && (
        <FormVendor
          isEditing={false}
          onClose={() => {
            setShowPopup(false);
            // Optionally re-fetch vendors list here if needed
          }}
        />
      )}
    </div>
  );
}

export default ListVendor;