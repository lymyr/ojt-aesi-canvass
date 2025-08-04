import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import axios from "../axios";
import s from "./listActions.module.css";

function Dashboard({ setTitle }) {
  console.log("mounted");
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

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
        <button onClick={() => navigate("/canvass/new")}>Add Canvass</button>
      </div>

      <ListView
        columns={["ID", "Created By", "Create Date", "Status"]}
        rows={rows}
        onRowClick={(row) => {
          // navigate to /canvass/:id — you can also pass `state: row`
          navigate(`/canvass/${row.ID}`, {
            state: { canvassId: row.ID },
          });
        }}
      />

      <Paginate/>
    </div>
  );
}

export default Dashboard;