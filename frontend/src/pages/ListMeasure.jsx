import { useEffect } from "react";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import s from "./listActions.module.css";

function ListMeasure({ setTitle }) {
  useEffect(() => {
    setTitle("Units of Measure List");
  }, [setTitle]);

  return (
    <div className={s.container}>
      <div className={s.listActions}>
        <Search />
        <button>Add UoM</button>
      </div>

      <ListView
        columns={["ID", "Unit of Measure", "Abbreviation"]}
        rows={[
          { ID: 1, "Unit of Measure": "Kilogram", Abbreviation: "kg" },
          { ID: 2, "Unit of Measure": "Liter", Abbreviation: "L" },
          { ID: 3, "Unit of Measure": "Meter", Abbreviation: "m" },
        ]}
      />

      <Paginate />
    </div>
  );
}

export default ListMeasure;