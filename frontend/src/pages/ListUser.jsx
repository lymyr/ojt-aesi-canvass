import { useEffect, useState } from "react";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import FormUser from "../components/FormUser";
import s from "./listActions.module.css";

import axios from "../axios"; // assuming this is your axios setup

function ListUser({ setTitle }) {
  const [showPopup, setShowPopup] = useState(false);
  const [users, setUsers] = useState([]); // for dynamic list

  useEffect(() => {
    setTitle("Users List");
    fetchUsers();
  }, [setTitle]);

  const fetchUsers = () => {
    axios.get("/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to fetch users:", err));
  };

  const handleSaveUser = async (data) => {
    try {
      const response = await axios.post("/api/users", data);
      console.log("User added:", response.data.user);
      setShowPopup(false);
      fetchUsers(); // refresh list
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
        columns={["User ID", "Username", "Password", "Role"]}
        rows={users.map(user => ({
          "User ID": user.id,
          Username: user.username,
          Password: "••••••••",
          Role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        }))}
      />

      <Paginate />

     {showPopup && (
        <FormUser
          onClose={() => setShowPopup(false)}
          refreshUsers={fetchUsers}
        />
      )}
    </div>
  );
}


export default ListUser;