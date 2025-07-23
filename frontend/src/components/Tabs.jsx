import s from "./Tabs.module.css";

function Tabs({ tabs = [], activeTab, setActiveTab }) {
  return (
    <div className={s.container}>
      <img src="../src/assets/tabs.svg" />
      <div className={s.tabContainer}>
        {tabs.map((tab) => (
          <p
            key={tab}
            className={activeTab === tab ? s.selected : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab[0].toUpperCase() + tab.slice(1)} {/* Capitalize */}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Tabs;
