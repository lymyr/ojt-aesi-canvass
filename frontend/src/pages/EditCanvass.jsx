import React, { useState } from "react";
import Tabs from "../components/Tabs";
import s from "./NewCanvass.module.css";
import CanvassForm from "../components/CanvassForm";
import Changelog from "../components/Changelog";
import DocAttach from "../components/DocAttach";

function EditCanvass() {
  const [activeTab, setActiveTab] = useState("table");
  const [editClicked, setEditClicked] = useState(false);

  return (
    <>
      <div className={s.btnContainer}>
        {!editClicked ? (
          <button className={s.save} onClick={() => setEditClicked(true)}>Edit</button>
        ) : (
          <>
            <button className={s.close} onClick={() => setEditClicked(false)}>Cancel</button>
            <button className={s.save}>Save</button>
          </>
        )}
      </div>

      <Tabs
        tabs={["table", "documents", "Changelog"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "table" && (
        <CanvassForm isEditing={true} editClicked={editClicked} />
      )}

      {activeTab === "documents" && (
        <DocAttach />
      )}

      {activeTab === "Changelog" && (
        <Changelog />
      )}
    </>
  );
}

export default EditCanvass;