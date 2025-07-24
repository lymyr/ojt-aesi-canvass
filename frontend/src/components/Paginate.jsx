import React, { useState } from "react";
import s from "./Paginate.module.css";

function Paginate() {
  const [page, setPage] = useState(1);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  return (
    <div className={s.container}>
      <button onClick={handlePrev} disabled={page === 1}>
        ← Prev
      </button>
      <span>Page {page}</span>
      <button onClick={handleNext}>Next →</button>
    </div>
  );
}

export default Paginate;