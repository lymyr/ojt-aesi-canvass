import React, { useState } from "react";
import s from "./Paginate.module.css";

function Paginate({ totalPages = 10 }) {
  const [page, setPage] = useState(1);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePageClick = (p) => {
    if (p !== page) setPage(p);
  };

  const getPageNumbers = () => {
    const pages = new Set();

    // Always include first, last, and current ±2
    pages.add(1);
    for (let i = page - 2; i <= page + 2; i++) {
      if (i > 1 && i < totalPages) {
        pages.add(i);
      }
    }
    pages.add(totalPages);

    return Array.from(pages).sort((a, b) => a - b);
  };

  const pages = getPageNumbers();

  return (
    <div className={s.container}>
      {pages.map((p, idx) => (
        <React.Fragment key={p}>
          {idx > 0 && p - pages[idx - 1] > 1 && <span className={s.ellipsis}>…</span>}
          <button
            onClick={() => handlePageClick(p)}
            className={`${s.pageBtn} ${p === page ? s.active : ""}`}
          >
            {p}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Paginate;