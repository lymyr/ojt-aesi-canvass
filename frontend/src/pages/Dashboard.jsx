import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import axios from "../axios";
import s from "./listActions.module.css";

function Dashboard({ setTitle }) {
  const [rows, setRows] = useState([]);

  const fetchCanvasses = async (page = 1) => {
    try {
      const res = await axios.get(`/api/canvass-sheets`);
      const formattedRows = res.data.data.map((c) => ({
        ID: c.id,
        "Created By": c.creator?.username || "Unknown",
        "Create Date": new Date(c.created_at).toLocaleDateString("en-CA"),
        Status: c.status?.name || "Unknown",
      }));
      setRows(formattedRows);
    } catch (error) {
      console.error("Error loading canvass sheets", error);
    }
  };

  useEffect(() => {
    setTitle("Canvass List");
    fetchCanvasses();
  }, [setTitle]);

  return (
    <div className={s.container}>
      <div className={s.listActions}>
        <Search />
        <Link to="/canvass/new"><button>Add Canvass</button></Link>
      </div>

      <ListView
        columns={["ID", "Created By", "Create Date", "Status"]}
        rows={rows}
      />

      <Paginate/>
    </div>
  );
}

export default Dashboard;