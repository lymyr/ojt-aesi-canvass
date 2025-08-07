import s from './DocAttach.module.css'
import { useEffect, useRef, useState } from "react";

function DocAttach({
  canvassData = {},
  editClicked,
  onChange,
  setDeletedAttachments,
  username // <-- New prop
}) {
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (canvassData && Array.isArray(canvassData.attachments)) {
      setAttachments(canvassData.attachments);
      setDeletedAttachments([]); 
    }
  }, [canvassData, editClicked]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = [...attachments, ...files];
    setAttachments(newAttachments);
    onChange?.(newAttachments);
  };

  const handleDelete = (indexToDelete) => {
    const fileToDelete = attachments[indexToDelete];
    const newAttachments = attachments.filter((_, i) => i !== indexToDelete);
    setAttachments(newAttachments);
    onChange?.(newAttachments);

    if (!(fileToDelete instanceof File)) {
      setDeletedAttachments?.(prev => [...prev, fileToDelete.id]);
    }
  };

  const isNewFile = (file) => file instanceof File;

  return (
    <div className={s.attach}>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        disabled={!editClicked}
        ref={fileInputRef}
      />

      {attachments.length > 0 && (
        <table className={s.table}>
          <thead>
            <tr>
              <th>File</th>
              <th>Added By</th>
              <th>Date Added</th>
              {editClicked && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {attachments.map((file, i) => {
              const isNew = isNewFile(file);
              const key = `${isNew ? 'new' : 'old'}-${i}-${isNew ? file.name : file.id || file.path}`;
              const addedBy = !isNew
                ? file.added_by ?? canvassData.created_by ?? '-'
                : username; // Use current username
              const createdAt = !isNew
                ? file.created_at
                  ? new Date(file.created_at).toLocaleString()
                  : new Date(canvassData.created_at).toLocaleString()
                : '-';

              return (
                <tr key={key} className={isNew ? s.newAttach : ''}>
                  <td>
                    {isNew ? (
                      file.name
                    ) : (
                      <a href={`http://localhost:8000/storage/${file.path}`} target="_blank" rel="noreferrer">
                        {file.file_name}
                      </a>
                    )}
                  </td>
                  <td>{addedBy}</td>
                  <td>{createdAt}</td>
                  {editClicked && (
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDelete(i)}
                        className={s.deleteBtn}
                      >
                        X
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DocAttach;