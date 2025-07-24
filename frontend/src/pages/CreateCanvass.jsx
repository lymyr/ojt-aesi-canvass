import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Tabs from "../components/Tabs";
import CanvassForm from "../components/CanvassForm";
import DocAttach from "../components/DocAttach";
import s from "./CanvassButtons.module.css";


function CreateCanvass({setTitle}) {
    useEffect(() => {
        setTitle("Create Canvass");
    }, [setTitle]);

  const [activeTab, setActiveTab] = useState("table");
  return (
    <>
      <div className={s.btnContainer}>
        <Link to="/"><button className={s.close}>Close</button></Link>
        <button className={s.save}>Create</button>
      </div>

      <Tabs
        tabs={["table", "documents"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div style={{ display: activeTab === "table" ? "block" : "none" }}>
        <CanvassForm />
      </div>

      <div style={{ display: activeTab === "documents" ? "block" : "none" }}>
        <DocAttach />
      </div>
    </>
  );
}

export default CreateCanvass;