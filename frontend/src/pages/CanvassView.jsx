import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Tabs from "../components/Tabs";
import CanvassForm from "../components/CanvassForm";
import Changelog from "../components/Changelog";
import DocAttach from "../components/DocAttach";
import s from "./CanvassButtons.module.css";

import axios from "../axios";

function CanvassView({
  mode = "create",           // "create" or "edit"
  setTitle,
  canvassId = null,
  userRole = "maker",    // "requestor" or "approver"
  status = "pending"         // "pending", "approved", "needs attention"
}) {
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  const formRef = useRef();
  const navigate = useNavigate();

  // Allow edit mode if requestor and status is pending
  const canEdit = userRole === "maker" && status === "pending";
  // Allow approve/reject if approver and status is pending
  const canApprove = userRole === "approver" && status === "pending";

  const [activeTab, setActiveTab] = useState("canvass sheet");
  const [editClicked, setEditClicked] = useState(isCreateMode);

  useEffect(() => {
    if (setTitle) {
      setTitle(isEditMode ? `Canvass #${canvassId}` : "Create Canvass");
    }
  }, [setTitle, isEditMode, canvassId]);

  const handleSave = async () => {
    if (!formRef.current) return;

    const formData = formRef.current.getFormData(); // 👈 Custom method from CanvassForm
    console.log("📤 Form Data being sent:", formData);
    try {
      await axios.post("/api/canvass-sheets", formData);
      alert("Canvass sheet saved successfully!");
      navigate("/"); // or another dummy route
      setTimeout(() => navigate("/canvass"), 10); // trigger reroute
    } catch (error) {
      console.error("Save failed:", error);
      alert("Error saving canvass sheet.");
    }
  };

  const handleApprove = () => {
    // approve logic here
  };

  const handleReject = () => {
    // reject logic here
  };

  const renderButtons = () => {
    if (isCreateMode) {
      return (
        <>
          <Link to="/canvass"><button className={s.close}>Close</button></Link>
          <button className={s.save} onClick={handleSave}>Save</button>
        </>
      );
    }

    if (canEdit) {
      return !editClicked ? (
        <>
          <button className={s.close}>Close</button>
          <button className={s.save} onClick={() => setEditClicked(true)}>Edit</button>
        </>
      ) : (
        <>
          <button className={s.close} onClick={() => setEditClicked(false)}>Cancel</button>
          <button className={s.save} onClick={handleSave}>Save</button>
        </>
      );
    }

    if (canApprove) {
      return (
        <>
          <button className={s.close}>Close</button>
          <button className={s.reject} onClick={handleReject}>Reject</button>
          <button className={s.save} onClick={handleApprove}>Approve</button>
        </>
      );
    }

    // Fallback (e.g., approved already or readonly)
    return (
      <button className={s.close}>Close</button>
    );
  };

  const tabs = ["canvass sheet", "documents"];
  if (isEditMode) {
    tabs.push("Changelog", "PDF");
  }

  return (
    <>
      <div className={s.btnContainer}>
        {renderButtons()}
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {isEditMode && (
        <div className={s.detailContainer}>
          <div></div>
          <div>
            <p><span>Created by: </span>Username</p>
            <p><span>Create Date: </span>{new Date().toLocaleString()}</p>
          </div>
        </div>
      )}

      <div style={{ display: activeTab === "canvass sheet" ? "block" : "none" }}>
        <CanvassForm
          ref={formRef}
          isEditing={isEditMode}
          editClicked={editClicked}
          canvassId={canvassId}
        />
      </div>

      <div style={{ display: activeTab === "documents" ? "block" : "none" }}>
        <DocAttach editClicked={editClicked || isCreateMode} />
      </div>

      {isEditMode && (
        <>
          <div style={{ display: activeTab === "Changelog" ? "block" : "none" }}>
            <Changelog />
          </div>
          <div style={{ display: activeTab === "PDF" ? "block" : "none" }}>
            {/* PDF preview component here */}
          </div>
        </>
      )}
    </>
  );
}

export default CanvassView;