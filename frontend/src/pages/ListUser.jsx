import { useEffect, useState } from "react";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import FormUser from "../components/FormUser";
import s from "./listActions.module.css";

import axios from "../axios";

function ListUser({ setTitle }) {
  const [showPopup, setShowPopup] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1); // ✅ for pagination
  const [totalPages, setTotalPages] = useState(1); // ✅ to limit navigation

  useEffect(() => {
    setTitle("Users List");
  }, [setTitle]);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (page = 1) => {
    try {
      const res = await axios.get(`/api/users?page=${page}&limit=10`);
      const { data, meta } = res.data;
      setUsers(data);
      setTotalPages(meta.last_page);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleSaveUser = async (data) => {
    try {
      await axios.post("/api/users", data);
      setShowPopup(false);
      fetchUsers(page); // Refresh current page
    } catch (err) {
      console.error("Error adding user:", err.response?.data || err.message);
      alert("Failed to add user. Please check for duplicate username or validation errors.");
    }
  };

  return (
    <div className={s.container}>
      <div className={s.listActions}>
        <Search />
        <button onClick={() => setShowPopup(true)}>Add User</button>
      </div>

      <ListView
        columns={["ID", "Username", "Password", "Role"]}
        rows={users.map(user => ({
          ID: user.id,
          Username: user.username,
          Password: "••••••••",
          Role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        }))}
      />

      <Paginate page={page} setPage={setPage} totalPages={totalPages} />

      {showPopup && (
        <FormUser
          onClose={() => setShowPopup(false)}
          refreshUsers={() => fetchUsers(page)}
        />
      )}
    </div>
  );
}

export default ListUser;