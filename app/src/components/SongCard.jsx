import save_icon from "../assets/save.svg";
import { addSongToLocal } from "../utils/localStorageHelpers";

const SongCard = ({ songTitle, songArtist, coverArt, id, currentTab }) => {
  const handleSave = (event) => {
    if (!event.target.closest(".save-icon")) return;
    const id = event.target.closest(".save-icon").dataset.songId;
    addSongToLocal(Number(id));
  };

  return (
    <li data-song-id={id} className="song-card">
      <div className="song-image-wrapper">
        <img src={coverArt} alt={`${songTitle} Album Cover`} />
      </div>
      <div id="song-details-wrapper">
        <h3>{songTitle}</h3>
        <p>{songArtist}</p>
      </div>
      <div id="save-icon-wrapper">
        <img
          className="save-icon"
          onClick={handleSave}
          data-song-id={id}
          style={{
            width: "30px",
            display: currentTab === "saved" ? "none" : "inline",
          }}
          src={save_icon}
          alt="Save Icon"
        />
      </div>
    </li>
  );
};

export default SongCard;
