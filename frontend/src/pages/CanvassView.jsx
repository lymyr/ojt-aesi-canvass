import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Tabs from "../components/Tabs";
import CanvassForm from "../components/CanvassForm";
import Changelog from "../components/Changelog";
import DocAttach from "../components/DocAttach";
import s from "./CanvassView.module.css";

import axios from "../axios";
import PdfView from "../components/PdfView";
import html2pdf from "html2pdf.js";

function CanvassView({mode = "create", setTitle, userRole = "maker", status = "pending", username}) {
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
  const [attachments, setAttachments] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);

  useEffect(() => {
    if (mode === "edit") {
      axios.get(`/api/canvass-sheets/${id}`).then(res => {
        setCanvassData(res.data);
        setAttachments(res.data.attachments || []);
      });
    }
  }, [id, mode]);


  const handleSave = async () => {
    if (!formRef.current) return;

    const formHasChanges = formRef.current.hasChanges();
    const attachmentsChanged = attachments.some(a => a instanceof File) || deletedAttachments.length > 0;
    if (isEditMode && !formHasChanges && !attachmentsChanged) {
      alert("No changes detected. Canvass sheet was not updated.");
      return;
    }
    
     // build FormData
    const formDataJSON = formRef.current.getFormData();
    const payload = new FormData();

    // 1) Append the canvass JSON
    payload.append('canvass_data', JSON.stringify(formDataJSON));
    console.log(JSON.stringify(formRef.current.getFormData(), null, 2));

    // 2) Append only new File objects
    attachments.forEach(file => {
      if (file instanceof File) {
        payload.append('attachments[]', file);
      }
    });

    if (deletedAttachments.length > 0) {
      deletedAttachments.forEach(id => {
        payload.append('deleted_attachments[]', id);
      });
    }


    // choose URL & method
    const url   = isEditMode
      ? `/api/canvass-sheets/${id}`
      : `/api/canvass-sheets`;
    const method = "post";
    if (isEditMode) {
      payload.append('_method', 'put');
    }
    try {
      const response = await axios.request({
        url,
        method,
        data: payload,
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert(response.data.message);
      navigate(isEditMode ? `/canvass` : `/`);
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

        alert("Canvass sheet has been successfully approved.");
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
    if (!reason) return alert("Rejection unsuccessful: please input a reason for rejection");

    const payload = new FormData();
    payload.append('_method', 'put');
    payload.append('canvass_data', JSON.stringify({
      status_id: 3,
      remarks: reason
    }));

    try {
      const response = await axios.post(`/api/canvass-sheets/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Canvass sheet has been successfully rejected.");
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

    if (canEdit && canvassData && canvassData.status != "Approved") {
      return !editClicked? (
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

    if (canApprove && canvassData && canvassData?.status == 'Pending') {
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

  const pdfRef = useRef(null);

  const handleDownload = () => {
    const element = pdfRef.current;
    const opt = {
      margin:       0.5,
      filename:     `Canvass-${id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 3 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

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
                    <div>
                      <p><span>Created by: </span>{canvassData.created_by}</p>
                      <p><span>Create date: </span>{new Date(canvassData.created_at).toLocaleString()}</p>
                    </div>
                    {canvassData.status == "Approved" && (
                      <div>
                        <p><span>Approved by: </span>{canvassData.approved_by}</p>
                        <p><span>Approved date: </span>{new Date(canvassData.updated_at).toLocaleString()}</p>
                      </div>
                    )}
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

      <div style={{ display: activeTab === "canvass sheet" ? "block" : "none" }} >
        <CanvassForm
          ref={formRef}
          isEditing={isEditMode}
          editClicked={editClicked}
          canvassId={id}
          initialData={isEditMode ? canvassData : null}
          status={canvassData?.status || null}
          userRole={userRole}
        />
        {canvassData && canvassData.remarks && (
          <div className={s.remarks}>
            <p>Rejection remarks</p>
            <p><span>{canvassData.approved_by}:</span> {canvassData.remarks}</p>
          </div>
          )}
      </div>

      <div style={{ display: activeTab === "documents" ? "block" : "none" }}>
        <DocAttach canvassData={canvassData} onChange={setAttachments} 
        setDeletedAttachments={setDeletedAttachments}
        username={username}
        editClicked={editClicked || isCreateMode} />
      </div>

      {isEditMode && (
        <>
          <div style={{ display: activeTab === "Changelog" ? "block" : "none" }}>
            <Changelog id={id}/>
          </div>

          {canvassData && (<div className={s.pdfContainer} style={{ display: activeTab === "PDF" ? "block" : "none" }}>
            <button className={s.downloadBtn} onClick={handleDownload}>Download</button>
              <PdfView ref={pdfRef} canvassData={canvassData} id={id} />
          </div>)}
        </>
      )}
    </>
  );
}

export default CanvassView;