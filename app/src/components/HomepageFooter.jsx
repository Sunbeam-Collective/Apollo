import dot_marker from "../assets/dot_marker.svg";
import trending_icon from "../assets/trending_icon.svg";
import trending_icon_active from "../assets/trending_icon_active.svg";
import save_icon from "../assets/save_icon.svg";
import save_icon_active from "../assets/save_icon_f_active.svg";

const HomepageFooter = ({ prop }) => {
  const { currentTab, setTab } = prop;

  const toggleTab = (tab) => {
    setTab(tab);
  };

  return (
    <div id="footer-wrapper">
      <div id="trending-wrapper">
        <button onClick={() => toggleTab("trending")}>
          <img
            id="trending-selector"
            src={
              currentTab === "trending" ? trending_icon_active : trending_icon
            }
            alt=""
          />
          <p>Trending</p>
        </button>
      </div>
      <div id="saved-wrapper">
        <button onClick={() => toggleTab("saved")}>
          <img
            id="saved-selector"
            src={currentTab === "saved" ? save_icon_active : save_icon}
            alt=""
          />
          <p>Saved</p>
        </button>
      </div>
    </div>
  );
};

export default HomepageFooter;
