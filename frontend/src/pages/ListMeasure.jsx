import { useEffect, useState } from "react";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import FormMeasure from "../components/FormMeasure";
import s from "./listActions.module.css";
import axios from "../axios";

function ListMeasure({ setTitle }) {
  const [showForm, setShowForm] = useState(false);
  const [measures, setMeasures] = useState([]);

  const fetchUoms = async () => {
    try {
      const response = await axios.get("/api/uoms");
      const data = response.data;

      const formatted = data.map((uom) => ({
        ID: uom.id,
        "Unit of Measure": uom.unit,
        Abbreviation: uom.abbreviation,
      }));

      setMeasures(formatted);
    } catch (error) {
      console.error("Error fetching UoMs:", error);
      alert("Failed to load units of measure.");
    }
  };

  useEffect(() => {
    setTitle("Units of Measure List");
    fetchUoms();
  }, [setTitle]);

  const handleFormClose = (shouldRefresh) => {
    setShowForm(false);
    if (shouldRefresh) fetchUoms(); // Reload after adding
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

      {showForm && <FormMeasure onClose={handleFormClose} />}
    </div>
  );
}

export default ListMeasure;