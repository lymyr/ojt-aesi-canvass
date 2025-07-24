import { useEffect } from "react";
import { Link } from "react-router-dom";

import Search from "../components/Search";
import ListView from "../components/ListView";
import s from "./listActions.module.css";
import Paginate from "../components/Paginate";


function Dashboard({setTitle}) {
    useEffect(() => {
        setTitle("Canvass List");
    }, [setTitle]);
    return (
        <>
            <div className={s.container}>
                <div className={s.listActions}>
                    <Search />
                    <Link to="/canvass/new"><button>Add Canvass</button></Link>
                </div>
                <ListView
                    columns={["ID", "Created By", "Create Date", "Status"]}
                    rows={[
                        { ID: 1, "Created By": "John", "Create Date": "2025-07-24", Status: "Pending" },
                        { ID: 2, "Created By": "Jane", "Create Date": "2025-07-23", Status: "Pending" },
                    ]}
                />

                <Paginate />
            </div>
        </>
    )
}

export default Dashboard