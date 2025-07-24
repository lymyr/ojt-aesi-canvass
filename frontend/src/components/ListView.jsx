import { Link } from "react-router-dom";
import s from "./ListView.module.css";


function ListView({ columns = [], rows = [] }) {
  return (
    <table className={s.table}>
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (  
                  <td key={colIndex}>{row[col] ?? ""}</td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: "center" }}>
              No data available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default ListView;
