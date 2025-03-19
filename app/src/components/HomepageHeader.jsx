import user_icon from "../assets/user_icon.svg";

const HomepageHeader = () => {
  return (
    <div id="homepage-header">
      <h1>apollo</h1>
      <img style={{ height: "40px" }} src={user_icon} alt="User Icon" />
    </div>
  );
};

export default HomepageHeader;
