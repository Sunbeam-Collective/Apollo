import SongCard from "./SongCard";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const savedData = [
  {
    id: 2461123655,
    songTitle: "Hell N Back (feat. Summer Walker)",
    songArtist: "Bakar",
    coverArt: "https://api.deezer.com/album/489849155/image",
    previewSrc:
      "https://cdnt-preview.dzcdn.net/api/1/1/2/4/5/0/245fea3e7d84dc08f4c64057db81f57a.mp3?hdnea=exp=1742407556~acl=/api/1/1/2/4/5/0/245fea3e7d84dc08f4c64057db81f57a.mp3*~data=user_id=0,application_id=42~hmac=c91c076c87d92763fd4339b77accc9102d08cd07beec97486b0862abaa6aa4c3",
  },
];

const SongList = ({ prop }) => {
  const { currentTab, songData } = prop;

  const navigate = useNavigate();

  const handleTrendingClick = async (e) => {
    if (!e.target.closest("li")) return;
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
        {currentTab === "trending" ? (
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
                />
              );
            })}
          </ul>
        ) : (
          <ul id="song-list" onClick={handleTrendingClick}>
            {savedData.map((song) => {
              return (
                <SongCard
                  key={song.id}
                  id={song.id}
                  songTitle={song.songTitle}
                  songArtist={song.songArtist}
                  coverArt={song.coverArt}
                  previewSrc={song.previewSrc}
                />
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default SongList;
