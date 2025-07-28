import { useEffect, useState } from "react";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import FormMeasure from "../components/FormMeasure";
import s from "./listActions.module.css";

function ListMeasure({ setTitle }) {
  useEffect(() => {
    setTitle("Units of Measure List");
  }, [setTitle]);

  const [showForm, setShowForm] = useState(false);
  const [measures, setMeasures] = useState([
    { ID: 1, "Unit of Measure": "Kilogram", Abbreviation: "kg" },
    { ID: 2, "Unit of Measure": "Liter", Abbreviation: "L" },
    { ID: 3, "Unit of Measure": "Meter", Abbreviation: "m" },
  ]);

  const handleAdd = (newData) => {
    setMeasures((prev) => [
      ...prev,
      {
        ID: prev.length + 1,
        "Unit of Measure": newData.unit,
        Abbreviation: newData.abbreviation,
      },
    ]);
    setShowForm(false);
  };

  return (
    <div className={s.container}>
      <div className={s.listActions}>
        <Search />
        <button onClick={() => setShowForm(true)}>Add UoM</button>
      </div>

      <ListView
        columns={["ID", "Unit of Measure", "Abbreviation"]}
        rows={measures}
      />

      <Paginate />

      {showForm && (
        <FormMeasure
          onClose={() => setShowForm(false)}
          onSave={handleAdd}
        />
      )}
    </div>
  );
}

export default ListMeasure;