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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUoms = async (page = 1) => {
    try {
      const response = await axios.get(`/api/uoms?limit=16&page=${page}`);
      const { data, meta } = response.data;

      const formatted = data.map((uom) => ({
        ID: uom.id,
        "Unit of Measure": uom.unit,
        Abbreviation: uom.abbreviation,
      }));

      setMeasures(formatted);
      setTotalPages(meta?.last_page || 1);
    } catch (error) {
      console.error("Error fetching UoMs:", error);
    }
  };

  useEffect(() => {
    setTitle("Units of Measure List");
  }, [setTitle]);

  useEffect(() => {
    fetchUoms(page);
  }, [page]);

  const handleFormClose = (shouldRefresh) => {
    setShowForm(false);
    if (shouldRefresh) fetchUoms(page); // Refresh same page
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

      <Paginate page={page} setPage={setPage} totalPages={totalPages} />

      {showForm && <FormMeasure onClose={handleFormClose} />}
    </div>
  );
}

export default ListMeasure;