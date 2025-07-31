import { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // ✅ import useLocation

function Sidebar({ user }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // ✅ get current path

  const isActive = (route) => {
    return location.pathname === route || location.pathname.startsWith(route + "/");
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <img
        src={collapsed ? "../src/assets/hamburger.svg" : "../src/assets/close.svg"}
        onClick={() => setCollapsed(!collapsed)}
        alt="toggle"
      />

      <div className="sidebar-top">
        <img src="../src/assets/logo-adjusted.svg" alt="logo" />
        {!collapsed && <h1><span>Ca</span>Tinko</h1>}

        <div className="nav-links">
          {[
            ["/canvass", "dashboard", "Dashboard"],
            ["/vendors", "vendor2", "Vendors"],
            ["/items", "item", "Items"],
            ["/uom", "uom", "Units of Measure"],
            // ["/canvass/edit", "vendor", "tempedit"],
            ...(user.role === "admin" ? [["/users", "user", "Users"]] : []),
          ].map(([route, icon, text]) => (
            <Link
              to={route}
              key={icon}
              className={`nav-item ${isActive(route) ? "active" : ""}`}
            >
              <img src={`../src/assets/${icon}.svg`} alt={text} />
              {!collapsed && <p>{text}</p>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
