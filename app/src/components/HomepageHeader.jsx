import {
  user_icon,
} from "../assets";

import {
  Link,
} from "react-router-dom";

const HomepageHeader = () => {
  return (
    <div id="homepage-header">
      <h1>apollo</h1>
      <Link to='/auth'>
        <img style={{ height: "40px" }} src={user_icon} alt="User Icon" />
      </Link>
    </div>
  );
};

export default HomepageHeader;
