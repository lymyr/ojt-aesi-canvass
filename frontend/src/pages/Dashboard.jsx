import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import axios from "../axios";
import s from "./listActions.module.css";

function Dashboard({ setTitle, userRole }) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchCanvasses = async (page = 1) => {
    try {
      const res = await axios.get(`/api/canvass-sheets?page=${page}&limit=16`);
      const canvassData = res.data?.data ?? [];
      const meta = res.data?.meta ?? { total: 0 };

      const formattedRows = canvassData.map((c) => ({
        ID: c.id,
        "Created By": c.created_by || "Unknown",
        "Create Date": new Date(c.date_created).toLocaleDateString("en-CA"),
        Status: c.status || "Unknown",
      }));

      setRows(formattedRows);
      setTotalPages(Math.ceil(meta.total / 16));
    } catch (error) {
      console.error("Error loading canvass sheets", error);
      setRows([]);
    }
  };

  useEffect(() => {
    setTitle("Canvass List");
  }, [setTitle]);

  useEffect(() => {
    fetchCanvasses(page);
  }, [page]);

  return (
    <div className={s.container}>
      <div className={s.listActions}>
        <Search />
        {userRole === "maker" && (
          <button onClick={() => navigate("/canvass/new")}>Add Canvass</button>
        )}
      </div>

      <ListView
        columns={["ID", "Created By", "Create Date", "Status"]}
        rows={rows}
        onRowClick={(row) => {
          navigate(`/canvass/${row.ID}`, {
            state: { canvassId: row.ID },
          });
        }}
      />

      <Paginate page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}

export default Dashboard;