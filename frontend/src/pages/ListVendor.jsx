import { useEffect } from "react";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import s from "./listActions.module.css";

function ListVendor({ setTitle }) {
  useEffect(() => {
    setTitle("Vendors List");
  }, [setTitle]);

  return (
    <div className={s.container}>
      <div className={s.listActions}>
        <Search />
        <button>Add Vendor</button>
      </div>

      <ListView
        columns={["ID", "Vendor Name", "Address", "TIN", "Remarks", "Active"]}
        rows={[
          {
            ID: 1,
            "Vendor Name": "ABC Suppliers Inc.",
            Address: "123 Katinko St., QC",
            TIN: "123-456-789",
            Remarks: "Reliable",
            Active: "Yes",
          },
          {
            ID: 2,
            "Vendor Name": "Medic Source",
            Address: "456 Wellness Ave., Makati",
            TIN: "987-654-321",
            Remarks: "Slow delivery",
            Active: "No",
          },
        ]}
      />

      <Paginate currentPage={1} totalPages={3} />
    </div>
  );
}

export default ListVendor;