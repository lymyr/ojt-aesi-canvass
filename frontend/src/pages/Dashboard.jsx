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
      const canvassData = res.data?.data ?? []; // default to [] if undefined
      const formattedRows = canvassData.map((c) => ({
        ID: c.id,
        "Created By": c.created_by || "Unknown",
        "Create Date": new Date(c.date_created).toLocaleDateString("en-CA"),
        Status: c.status || "Unknown",
      }));
      setRows(formattedRows);
    } catch (error) {
      console.error("Error loading canvass sheets", error);
      setRows([]); // fallback
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