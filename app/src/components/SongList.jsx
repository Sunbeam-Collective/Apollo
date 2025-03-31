import SongCard from "./SongCard";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";
import { getLocalStorageData } from "../utils/localStorageHelpers";
import Loading from "./Loading";
import { useContext } from "react";
import { SongContext } from "../context";

const SongList = ({ prop }) => {
  const { renderedSongs, currentTab, error } = prop;
  // State to manage state of search bar in trending tab
  const { trendingSearch } = useContext(SongContext);
  // State to manage state of search bar in saved tab
  const { savedSearch } = useContext(SongContext);

  const navigate = useNavigate();

  const handleTrendingClick = async (e) => {
    // Don't open player if user is clicking on save or is not clicking on a li (song) item
    if (
      !e.target.closest("li") ||
      e.target.closest(".save-icon") ||
      e.target.closest(".save-icon-active")
    )
      return;
    const songId = e.target.closest("li").dataset.songId;
    navigate(`/player/${songId}`, { state: { from: `/home` } });
  };

  // Let user know there was a fetching error
  if (error)
    return (
      <Alert message="Error while fetching songs. Please reload the page and try again." />
    );

  // Loading animation
  while (!renderedSongs) {
    return (
      <div id="song-list-wrapper">
        <Loading />
      </div>
    );
  }

  // If user is on saved and localStorage is empty it means user has no saved songs
  if (currentTab === "saved" && getLocalStorageData().length === 0)
    // Let user know they have no saved songs
    return <Alert message="No Songs Saved" />;

  // Handle No results within trending or saved tab
  if (
    (renderedSongs.length === 0 && trendingSearch) ||
    (renderedSongs.length === 0 && savedSearch)
  )
    return <Alert message="No Results Found" />;

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
                currentTab={currentTab}
                position={song.position}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default SongList;
