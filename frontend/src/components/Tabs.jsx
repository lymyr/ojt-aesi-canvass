import s from "./Tabs.module.css";

function Tabs({ tabs = [], activeTab, setActiveTab }) {
  const capitalizeWords = (text) =>
    text.replace(/\b\w/g, (char) => char.toUpperCase());

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
            {capitalizeWords(tab)}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Tabs;