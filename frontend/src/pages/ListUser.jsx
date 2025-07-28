import { useEffect, useState } from "react";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import FormUser from "../components/FormUser";
import s from "./listActions.module.css";

function ListUser({ setTitle }) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setTitle("Users List");
  }, [setTitle]);

  const handleSaveUser = (data) => {
    console.log("Saved user:", data);
    setShowPopup(false);
  };

  return (
    <div className={s.container}>
      <div className={s.listActions}>
        <Search />
        <button onClick={() => setShowPopup(true)}>Add User</button>
      </div>

      <ListView
        columns={["User ID", "Username", "Password", "Role"]}
        rows={[
          { "User ID": 1, Username: "jdoe", Password: "••••••••", Role: "Maker" },
          { "User ID": 2, Username: "admin", Password: "••••••••", Role: "Admin" },
          { "User ID": 3, Username: "maria.approver", Password: "••••••••", Role: "Approver" },
        ]}
      />

      <Paginate currentPage={1} totalPages={2} />

      {showPopup && (
        <FormUser
          onClose={() => setShowPopup(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}

export default ListUser;