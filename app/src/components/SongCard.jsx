import save_icon from "../assets/save.svg";

const SongCard = ({ songTitle, songArtist, coverArt, id }) => {
  return (
    <li data-song-id={id} className="song-card">
      <div className="song-image-wrapper">
        <img
          style={{ height: "126px", width: "126px" }}
          src={coverArt}
          alt={`${songTitle} Album Cover`}
        />
      </div>
      <div id="song-details-wrapper">
        <h3>{songTitle}</h3>
        <p>{songArtist}</p>
      </div>
      <div style={{ width: "25%" }}>
        <img style={{ width: "30px" }} src={save_icon} alt="Save Icon" />
      </div>
    </li>
  );
};

export default SongCard;
