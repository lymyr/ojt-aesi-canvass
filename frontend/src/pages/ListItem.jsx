import { useEffect } from "react";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import s from "./listActions.module.css";

function ListItem({ setTitle }) {
  useEffect(() => {
    setTitle("Items List");
  }, [setTitle]);

  return (
    <div className={s.container}>
      <div className={s.listActions}>
        <Search />
        <button>Add Item</button>
      </div>

      <ListView
        columns={["ID", "Description", "Unit of Measure", "Remarks"]}
        rows={[
          {
            ID: 101,
            Description: "Menthol Crystals",
            "Unit of Measure": "Kilogram",
            Remarks: "For mixing",
          },
          {
            ID: 102,
            Description: "Glass Bottle 30ml",
            "Unit of Measure": "Piece",
            Remarks: "Used in packaging",
          },
        ]}
      />

      <Paginate />
    </div>
  );
}

export default ListItem;