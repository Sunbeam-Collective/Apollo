import SongCard from "./SongCard";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const SongList = ({ prop }) => {
  const { renderedSongs, currentTab, setRenderedSongs } = prop;

  const navigate = useNavigate();

  const handleTrendingClick = async (e) => {
    if (
      !e.target.closest("li") ||
      e.target.closest(".save-icon") ||
      e.target.closest(".save-icon-active")
    )
      return;
    const id = e.target.closest("li").dataset.songId;
    navigate(
      `/player/${id}`,
      {
        state: {
          from: `/home`
        }
      }
    )
};

  // Handle No Song Data Yet
  if (!renderedSongs)
    return (
      <div id="song-list-wrapper">
        <Loading />
      </div>
    );

  // Handle No Saved Songs
  if (renderedSongs.length === 0 && currentTab === "saved")
    return (
      <div id="song-list-wrapper">
        <Alert message="No Songs Saved" />
      </div>
    );

  // Handle No results within trending tab
  if (renderedSongs.length === 0 && currentTab === "trending")
    return (
      <div id="song-list-wrapper">
        <Alert message="No results Found" />
      </div>
    );

  return (
    <>
      <div id="song-list-wrapper">
        <ul id="song-list" onClick={handleTrendingClick}>
          {renderedSongs.map((song) => {
            return (
              <SongCard
                key={crypto.randomUUID()}
                id={song.id}
                songTitle={song.title}
                songArtist={song.artist.name}
                coverArt={song.album.cover_xl}
                previewSrc={song.preview}
                currentTab={currentTab}
                setRenderedSongs={setRenderedSongs}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default SongList;
