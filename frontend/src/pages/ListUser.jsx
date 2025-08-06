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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleRowClick = async (id) => {
    try {
      const res = await axios.get(`/api/users/${id}`);
      setSelectedUser(res.data);      // Pass fetched user data
      setIsEditing(true);             // Edit mode
      setShowPopup(true);             // Show the modal
    } catch (err) {
      console.error("Error fetching user data:", err);
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
        onRowClick={(row) => handleRowClick(row.ID)}
      />

      <Paginate page={page} setPage={setPage} totalPages={totalPages} />

      {showPopup && (
        <FormUser
          onClose={() => {
            setShowPopup(false);
            setSelectedUser(null);
            setIsEditing(false);
          }}
          userData={selectedUser || {}}
          isEditing={isEditing}
          refreshUsers={() => fetchUsers(page)}
        />
      )}
    </div>
  );
}

export default ListUser;