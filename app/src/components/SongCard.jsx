import SaveButton from "./SaveButton";

const SongCard = ({
  songTitle,
  songArtist,
  coverArt,
  id,
  position,
  currentTab,
}) => {
  return (
    <li data-song-id={id} className="song-card">
      <h2 style={{ display: position ? "block" : "none" }}>#{position}</h2>
      <div className="song-image-wrapper">
        <img src={coverArt} alt={`${songTitle} Album Cover`} />
      </div>
      <div id="song-details-wrapper">
        <h3>{songTitle}</h3>
        <p>{songArtist}</p>
      </div>
      <div id="save-icon-wrapper">
        <SaveButton prop={{ id, currentTab }} />
      </div>
    </li>
  );
};

export default SongCard;
