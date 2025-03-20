import SongCard from "./SongCard";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const SongList = ({ prop }) => {
  const { currentTab, songData } = prop;

  const navigate = useNavigate();

  const handleTrendingClick = async (e) => {
    if (!e.target.closest("li") || e.target.closest(".save-icon")) return;
    const id = e.target.closest("li").dataset.songId;
    navigate(`/player/${id}`);
  };

  // Handle No Song Data
  if (!songData)
    return (
      <div id="song-list-wrapper">
        <Loading />;
      </div>
    );

  // Handle No Results Found
  if (songData.length === 0)
    return (
      <div id="song-list-wrapper">
        <Alert message="No results Found" />
      </div>
    );

  return (
    <>
      <div id="song-list-wrapper">
        <ul id="song-list" onClick={handleTrendingClick}>
          {songData.map((song) => {
            return (
              <SongCard
                key={song.id}
                id={song.id}
                songTitle={song.title}
                songArtist={song.artist.name}
                coverArt={song.album.cover_xl}
                previewSrc={song.preview}
                currentTab={currentTab}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default SongList;
