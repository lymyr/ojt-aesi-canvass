import { useEffect, useState } from "react";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import FormItem from "../components/FormItem";
import s from "./listActions.module.css";
import axios from "../axios";

function ListItem({ setTitle }) {
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async (page = 1) => {
    try {
      const res = await axios.get(`/api/items?limit=16&page=${page}`);
      const data = res.data?.data ?? [];
      const meta = res.data?.meta;

      setItems(data);
      setTotalPages(meta?.last_page ?? 1);
    } catch (err) {
      console.error("Failed to fetch items", err);
    }
  };

  useEffect(() => {
    setTitle("Items List");
  }, [setTitle]);

  useEffect(() => {
    fetchItems(page);
  }, [page]);

  const handleRowClick = async (row) => {
    try {
      const res = await axios.get(`/api/items/${row.ID}`);
      setSelectedItem(res.data);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to fetch item by ID", err);
      alert("Error fetching item details.");
    }
  };

  return (
    <div className={s.container}>
      <div className={s.listActions}>
        <Search />
        <button onClick={() => setShowForm(true)}>Add Item</button>
      </div>

      {showForm && (
        <FormItem
          isEditing={!!selectedItem}
          itemData={selectedItem ?? undefined}
          onClose={() => {
            setShowForm(false);
            setSelectedItem(null);
          }}
          onSuccess={() => fetchItems(page)}
        />
      )}


      <ListView
        columns={["ID", "Description", "Unit of Measure", "Remarks"]}
        rows={items.map(item => ({
          ID: item.id,
          Description: item.description,
          "Unit of Measure": item.uom?.abbreviation || "N/A",
          Remarks: item.remarks || "",
        }))}
        onRowClick={handleRowClick}
      />

      <Paginate page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}

export default ListItem;