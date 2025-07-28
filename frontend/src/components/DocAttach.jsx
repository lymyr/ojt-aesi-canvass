import s from './DocAttach.module.css'
import { useState } from "react";

function DocAttach({ editClicked }) {
  const [attachments, setAttachments] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setAttachments(selectedFiles);
  };

  return (
    <div className={s.attach}>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        disabled={!editClicked}
      />
      {attachments.length > 0 && (
        <ul>
          {attachments.map((file, i) => (
            <li key={i}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DocAttach;
