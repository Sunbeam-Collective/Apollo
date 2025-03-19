import dot_marker from "../assets/dot_marker.svg";

const HomepageFooter = ({ prop }) => {
  const { setTab } = prop;

  const toggleTab = (tab) => {
    setTab(tab);
  };

  return (
    <div id="footer-wrapper">
      <div id="trending-wrapper">
        <button onClick={() => toggleTab("trending")}>
          <p>Trending</p>
          <img
            id="trending-selector"
            style={{ height: "6px" }}
            src={dot_marker}
            alt=""
          />
        </button>
      </div>
      <div id="saved-wrapper">
        <button onClick={() => toggleTab("saved")}>
          <p>Saved</p>
          <img
            id="saved-selector"
            style={{ height: "6px", display: "none" }}
            src={dot_marker}
            alt=""
          />
        </button>
      </div>
    </div>
  );
};

export default HomepageFooter;
