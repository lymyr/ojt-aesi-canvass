import { useEffect, useState } from "react";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import FormVendor from "../components/FormVendor";
import s from "./listActions.module.css";
import axios from "../axios";

function ListVendor({ setTitle }) {
  const [showPopup, setShowPopup] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVendors = async (page = 1) => {
    try {
      const res = await axios.get(`/api/vendors?limit=16&page=${page}`);
      const data = res.data?.data ?? [];
      const meta = res.data?.meta ?? {};

      setVendors(data);
      setTotalPages(meta.last_page ?? 1);
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
    }
  };

  useEffect(() => {
    setTitle("Vendors List");
  }, [setTitle]);

  useEffect(() => {
    fetchVendors(page);
  }, [page]);

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

      <Paginate page={page} setPage={setPage} totalPages={totalPages} />

      {showPopup && (
        <FormVendor
          isEditing={false}
          onClose={() => {
            setShowPopup(false);
            fetchVendors(page);
          }}
        />
      )}
    </div>
  );
}

export default ListVendor;