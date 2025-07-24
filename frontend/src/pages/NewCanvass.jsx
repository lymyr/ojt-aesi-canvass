import { useState } from "react";
import Tabs from "../components/Tabs";
import CanvassForm from "../components/CanvassForm";
import DocAttach from "../components/DocAttach";
import s from "./NewCanvass.module.css";

function NewCanvass() {
  const [activeTab, setActiveTab] = useState("table");

  return (
    <>
      <div className={s.btnContainer}>
        <button className={s.close}>Close</button>
        <button className={s.save}>Create</button>
      </div>

      <Tabs
        tabs={["table", "documents"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "table" && <CanvassForm />}

      {activeTab === "documents" && (
       <DocAttach />
      )}
    </>
  );
}

export default NewCanvass;