import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Tabs from "../components/Tabs";
import CanvassForm from "../components/CanvassForm";
import Changelog from "../components/Changelog";
import DocAttach from "../components/DocAttach";
import s from "./CanvassView.module.css";

import axios from "../axios";
import PdfView from "../components/PdfView";

function CanvassView({
  mode = "create",           // "create" or "edit"
  setTitle,
  userRole = "maker",        // or approver
  status = "pending"         // "pending", "approved", "needs attention"
}) {
    
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";
  const { id } = useParams();
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
      setTitle(isEditMode ? `Canvass #${id}` : "Create Canvass");
    }
  }, [setTitle, isEditMode, id]);

  const [canvassData, setCanvassData] = useState(null);
  
  useEffect(() => {
    if (mode === "edit") {
      axios.get(`/api/canvass-sheets/${id}`).then(res => {
        setCanvassData(res.data);
      });
    }
  }, [id, mode]);

  const handleSave = async () => {
    if (!formRef.current) return;

    const formData = formRef.current.getFormData(); // Custom method from CanvassForm
    try {
        const url = isEditMode ? `/api/canvass-sheets/${id}` : "/api/canvass-sheets";
        const method = isEditMode ? "put" : "post";
        const response = await axios[method](url, formData);
        alert(response.data.message); // ✅ get success message from backend
        method === 'put' ? navigate(`/api/canvass-sheets/${id}`) : navigate("/");
        setTimeout(() => navigate("/canvass"), 10);
    } catch (error) {
        console.error("Save failed:", error);
        const res = error.response?.data;
        if (error.response?.status === 422 && res?.errors) {
            const messages = Object.values(res.errors).flat().map(msg => `- ${msg}`).join('\n');
            alert(`Canvass sheet error\n${messages}`);
        } else {
            const message = `${"Error saving canvass sheet."}${res?.error ? `\n${res.error}` : ""}`;
            alert(message);
        }

    }
  };


  const handleApprove = async () => {
    if (userRole !== "approver") return;
    if (confirm("Are you sure you want to approve this canvass?")) {
      try {
        const response = await axios.put(`/api/canvass-sheets/${id}`, {
          status_id: 2,
          remarks: null
        });

        alert("Canvass approved.");
        navigate("/canvass");
      } catch (error) {
        console.error("Approve failed:", error);
        alert("Failed to approve canvass.");
      }
    };
  }

  const handleReject = async () => {
    if (userRole !== "approver") return;

    const reason = prompt("Enter reason for rejection:");
    if (!reason) return;

    try {
      const response = await axios.put(`/api/canvass-sheets/${id}`, {
        status_id: 3, // 👈 assuming 3 = "Needs Attention", adjust as needed
        remarks: reason,
      });

      alert("Canvass rejected.");
      navigate("/canvass");
    } catch (error) {
      console.error("Reject failed:", error);
      alert("Failed to reject canvass.");
    }
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
          <Link to="/canvass"><button className={s.close}>Close</button></Link>
          <button className={s.save} onClick={() => setEditClicked(true)}>Edit</button>
        </>
      ) : (
        <>
          <button className={s.close} onClick={() => {confirm("Unsaved edits will be lost. Do you want to proceed?") && setEditClicked(false)}}>Cancel</button>
          <button className={s.save} onClick={() => {confirm("Would you like to save your changes?") && handleSave()}}>Save</button>
        </>
      );
    }

    if (canApprove && canvassData?.status == 'Pending') {
      return (
        <>
          <Link to="/canvass"><button className={s.close}>Close</button></Link>
          <button className={s.reject} onClick={handleReject}>Reject</button>
          <button className={s.save} onClick={handleApprove}>Approve</button>
        </>
      );
    }

    // Fallback (e.g., approved already or readonly)
    return (
      <Link to="/canvass"><button className={s.close}>Close</button></Link>
    );
  };

  const [tabs, setTabs] = useState(["canvass sheet", "documents"]);
  useEffect(() => {
    const newTabs = ["canvass sheet", "documents"];

    if (isEditMode) {
      newTabs.push("Changelog");
    }
    if (!canvassData) return;
    if (canvassData.status === "Approved") {
      newTabs.push("PDF");
    }

    setTabs(newTabs);
  }, [isEditMode, canvassData]);


  return (
    <>
      <div className={s.headerContainer}>
        {canvassData && (
                <div className={`${s.canvassStatus} ${s[canvassData.status.replace(/\s+/g, "")]}`}>
                    <p>{canvassData.status}</p>
                    {canvassData.status === "Pending" && (<img src="../src/assets/pending.svg"/>)}
                    {canvassData.status === "Needs Attention" && (<img src="../src/assets/attention.svg"/>)}
                    {canvassData.status === "Approved" && (<img src="../src/assets/approved.svg"/>)}
                </div>
        )}
        <div className={s.detailContainer}>
            {canvassData && (
                <div>
                    <p><span>Created by: </span>{canvassData.created_by}</p>
                    <p><span>Create Date: </span>{new Date(canvassData.created_at).toLocaleString()}</p>
                </div>
            )}
        </div>
        <div className={s.btnContainer}>
            {renderButtons()}
        </div>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div style={{ display: activeTab === "canvass sheet" ? "block" : "none" }}>
        <CanvassForm
          ref={formRef}
          isEditing={isEditMode}
          editClicked={editClicked}
          canvassId={id}
          initialData={isEditMode ? canvassData : null}
        />
        {canvassData && canvassData.remarks && (
          <div className={s.remarks}>
            <p>Rejection remarks</p>
            <p>{canvassData.remarks}</p>
          </div>
          )}
      </div>

      <div style={{ display: activeTab === "documents" ? "block" : "none" }}>
        <DocAttach editClicked={editClicked || isCreateMode} />
      </div>

      {isEditMode && (
        <>
          <div style={{ display: activeTab === "Changelog" ? "block" : "none" }}>
            <Changelog />
          </div>
          {canvassData && (<div style={{ display: activeTab === "PDF" ? "block" : "none" }}>
            <button className={s.downloadBtn}>Download</button>
            <PdfView canvassData={canvassData} id={id} />
          </div>)}
        </>
      )}
    </>
  );
}

export default CanvassView;