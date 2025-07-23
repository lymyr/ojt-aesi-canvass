import { useState } from "react";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

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
            ["dashboard", "Dashboard"],
            ["vendor2", "Vendors"],
            ["item", "Items"],
            ["uom", "Units of Measure"],
            ["user", "Users"],
            ["logout", "Log out"],
          ].map(([icon, text]) => (
            <div key={icon} className="nav-item">
              <img src={`../src/assets/${icon}.svg`} alt={text} />
              {!collapsed && <p>{text}</p>}
            </div>
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
