import { useNavigate, useLocation, useParams } from "react-router-dom";
import { back_icon } from "../assets";
import { useContext } from "react";
import { SongContext } from "../context";

function SecondaryNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTab } = useContext(SongContext);
  const { id } = useParams();

  const handleClick = () => {
    if (location.pathname.startsWith("/player")) {
      navigate(`/home`, { state: { from: location.pathname } });
    } else if (location.pathname.startsWith("/mixer")) {
      navigate(`/player/${id}`, { state: { from: location.pathname } });
    }
  };

  return (
    <div className="secondary-nav">
      <button
        id="back-button"
        onClick={handleClick} // navigate back one page
      >
        <img src={back_icon} />
        {/* {'<'} Back */}
      </button>
      <div className="secondary-nav-padding" />
    </div>
  );
}

export default SecondaryNav;
