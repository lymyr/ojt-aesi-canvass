import { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // ✅ import useLocation

function Sidebar() {
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
            ["/", "dashboard", "Dashboard"],
            ["/vendors", "vendor2", "Vendors"],
            ["/items", "item", "Items"],
            ["/uom", "uom", "Units of Measure"],
            ["/users", "user", "Users"],
            ["/logout", "logout", "Log out"],
            ["/canvass/edit", "vendor", "Temp Edit"]
          ].map(([route, icon, text]) => (
            <Link
              to={route}
              key={icon}
              className={`nav-item ${isActive(route) ? "active" : ""}`} // ✅ apply class
            >
              <img src={`../src/assets/${icon}.svg`} alt={text} />
              {!collapsed && <p>{text}</p>}
            </Link>
          ))}
        </div>
      </div>

      {!collapsed && (
        <div className="profile">
          <p>name</p>
          <p>maker</p>
          <p>reset password</p>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
