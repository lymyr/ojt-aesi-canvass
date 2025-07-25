import { useState, useEffect } from "react";
import Tabs from "../components/Tabs";
import s from "./CanvassButtons.module.css";
import CanvassForm from "../components/CanvassForm";
import Changelog from "../components/Changelog";
import DocAttach from "../components/DocAttach";

function EditCanvass({setTitle}) {
  useEffect(() => {
    setTitle("Edit Canvass");
  }, [setTitle]);

  const [activeTab, setActiveTab] = useState("table");
  const [editClicked, setEditClicked] = useState(false);
  
  return (
    <>
      <div className={s.btnContainer}>
        {!editClicked ? (
          <>
            <button className={s.close}>Close</button>
            <button className={s.save} onClick={() => setEditClicked(true)}>Edit</button>
          </>
        ) : (
          <>
            <button className={s.close} onClick={() => setEditClicked(false)}>Cancel</button>
            <button className={s.save}>Save</button>
          </>
        )}
      </div>

      <Tabs
        tabs={["table", "documents", "Changelog", "PDF"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className={s.detailContainer}>
        <div>
          <p>Canvass #123</p>
          <p>Pending</p>
        </div>
        <div>
          <p><span>Created by: </span>Username</p>
          <p><span>Create Date: </span>{new Date().toLocaleString()}</p>
        </div>
      </div>


      <div style={{ display: activeTab === "table" ? "block" : "none" }}>
        <CanvassForm isEditing={true} editClicked={editClicked} />
      </div>

      <div style={{ display: activeTab === "documents" ? "block" : "none" }}>
        <DocAttach />
      </div>

      <div style={{ display: activeTab === "Changelog" ? "block" : "none" }}>
        <Changelog />
      </div>
    </>
  );
}

export default EditCanvass;