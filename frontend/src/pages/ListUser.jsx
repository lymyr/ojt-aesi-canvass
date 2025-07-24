import { useEffect } from "react";
import Search from "../components/Search";
import ListView from "../components/ListView";
import Paginate from "../components/Paginate";
import s from "./listActions.module.css";

function ListUser({ setTitle }) {
  useEffect(() => {
    setTitle("Users List");
  }, [setTitle]);

  return (
    <div className={s.container}>
      <div className={s.listActions}>
        <Search />
        <button>Add User</button>
      </div>

      <ListView
        columns={["User ID", "Username", "Password", "Role"]}
        rows={[
          {
            "User ID": 1,
            Username: "jdoe",
            Password: "••••••••", // for visual masking
            Role: "Maker",
          },
          {
            "User ID": 2,
            Username: "admin",
            Password: "••••••••",
            Role: "Admin",
          },
          {
            "User ID": 3,
            Username: "maria.approver",
            Password: "••••••••",
            Role: "Approver",
          },
        ]}
      />

      <Paginate currentPage={1} totalPages={2} />
    </div>
  );
}

export default ListUser;