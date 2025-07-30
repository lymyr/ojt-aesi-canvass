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

  useEffect(() => {
    setTitle("Items List");

    axios.get("/api/items")
      .then(res => setItems(res.data))
      .catch(err => console.error("Failed to fetch items", err));
  }, [setTitle]);

  const handleAddItem = async (data) => {
    try {
      const res = await axios.post("/api/items", data);
      const newItem = res.data;
      setItems(prev => [...prev, newItem]);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to save item", err);
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
          isEditing={false}
          onClose={() => setShowForm(false)}
          onSuccess={(newItem) => setItems(prev => [...prev, newItem])}
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
      />

      <Paginate />
    </div>
  );
}

export default ListItem;