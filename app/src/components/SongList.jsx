import SongCard from "./SongCard";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";

const savedData = [
  {
    id: 2461123655,
    songTitle: "Hell N Back (feat. Summer Walker)",
    songArtist: "Bakar",
    coverArt: "https://api.deezer.com/album/489849155/image",
    previewSrc:
      "https://cdnt-preview.dzcdn.net/api/1/1/2/4/5/0/245fea3e7d84dc08f4c64057db81f57a.mp3?hdnea=exp=1742407556~acl=/api/1/1/2/4/5/0/245fea3e7d84dc08f4c64057db81f57a.mp3*~data=user_id=0,application_id=42~hmac=c91c076c87d92763fd4339b77accc9102d08cd07beec97486b0862abaa6aa4c3",
  },
  {
    id: 3050380851,
    songTitle: "APT.",
    songArtist: "ROSÉ",
    coverArt: "https://api.deezer.com/album/658285691/image",
    previewSrc:
      "https://cdnt-preview.dzcdn.net/api/1/1/b/5/f/0/b5f4d43a587c9c2bf2095881ef5c60d7.mp3?hdnea=exp=1742407556~acl=/api/1/1/b/5/f/0/b5f4d43a587c9c2bf2095881ef5c60d7.mp3*~data=user_id=0,application_id=42~hmac=0471ac9c5b03ceb762ceba9a05e41a880ad130f8427fc3e1f56b441b13314446",
  },
  {
    id: 3047560351,
    songTitle: "That’s So True",
    songArtist: "Gracie Abrams",
    coverArt: "https://api.deezer.com/album/657452321/image",
    previewSrc:
      "https://cdnt-preview.dzcdn.net/api/1/1/4/a/f/0/4aff247a00d3d56397979d26af23ada5.mp3?hdnea=exp=1742407556~acl=/api/1/1/4/a/f/0/4aff247a00d3d56397979d26af23ada5.mp3*~data=user_id=0,application_id=42~hmac=7875666d4f45e65082388d2cf34a15273a33dd9a9f8f89acc2f62e8f91060780",
  },
  {
    id: 2815968782,
    songTitle: "Messy",
    songArtist: "Lola Young",
    coverArt: "https://api.deezer.com/album/591239352/image",
    previewSrc:
      "https://cdnt-preview.dzcdn.net/api/1/1/3/b/5/0/3b5a5013027d0eb81daec7412a9a0aec.mp3?hdnea=exp=1742407556~acl=/api/1/1/3/b/5/0/3b5a5013027d0eb81daec7412a9a0aec.mp3*~data=user_id=0,application_id=42~hmac=dc6cdf25be149fa6669d5613a8b5e04475195de4d74c72eaf2eab68fe4218c2b",
  },
  {
    id: 2801558052,
    songTitle: "BIRDS OF A FEATHER",
    songArtist: "Billie Eilish",
    coverArt: "https://api.deezer.com/album/586786102/image",
    previewSrc:
      "https://cdnt-preview.dzcdn.net/api/1/1/5/e/0/0/5e0fb99f6f1e0f18ab70a4c0d18efa5c.mp3?hdnea=exp=1742407556~acl=/api/1/1/5/e/0/0/5e0fb99f6f1e0f18ab70a4c0d18efa5c.mp3*~data=user_id=0,application_id=42~hmac=e0ae5a130d018f03b4b7eeddc6ddd0bd7bd6cfd923fdc0eaf1302f86751111e5",
  },
  {
    id: 2947516331,
    songTitle: "Die With A Smile",
    songArtist: "Lady Gaga",
    coverArt: "https://api.deezer.com/album/629506181/image",
    previewSrc:
      "https://cdnt-preview.dzcdn.net/api/1/1/4/5/9/0/459c235b39ef8badd04c5ef181f58c24.mp3?hdnea=exp=1742407556~acl=/api/1/1/4/5/9/0/459c235b39ef8badd04c5ef181f58c24.mp3*~data=user_id=0,application_id=42~hmac=5439d12a1fb2f5d2fb9a31b64950d1e2a593ac70b5956ef2f2eca6d656e51377",
  },
  {
    id: 3196460531,
    songTitle: "Sports car",
    songArtist: "Tate McRae",
    coverArt: "https://api.deezer.com/album/701157501/image",
    previewSrc:
      "https://cdnt-preview.dzcdn.net/api/1/1/f/3/e/0/f3e5caa86999c6256b781ade2fa6b776.mp3?hdnea=exp=1742407556~acl=/api/1/1/f/3/e/0/f3e5caa86999c6256b781ade2fa6b776.mp3*~data=user_id=0,application_id=42~hmac=9a3b9b72d2c929cebd5ccb45c52f8972067f54d58048564d306736654a917250",
  },
  {
    id: 2454854845,
    songTitle: "Pink Pony Club",
    songArtist: "Chappell Roan",
    coverArt: "https://api.deezer.com/album/488063815/image",
    previewSrc:
      "https://cdnt-preview.dzcdn.net/api/1/1/c/c/7/0/cc7db99ce3da9b69b637da91d28f6039.mp3?hdnea=exp=1742407556~acl=/api/1/1/c/c/7/0/cc7db99ce3da9b69b637da91d28f6039.mp3*~data=user_id=0,application_id=42~hmac=22e4e91777c2c0e1c9ff474d738967462662d66ab542025e34fba9e2e898afd5",
  },
  {
    id: 2743578151,
    songTitle: "Espresso",
    songArtist: "Sabrina Carpenter",
    coverArt: "https://api.deezer.com/album/571147791/image",
    previewSrc:
      "https://cdnt-preview.dzcdn.net/api/1/1/1/7/a/0/17a21c40ce4af3ac9514aac756403188.mp3?hdnea=exp=1742407556~acl=/api/1/1/1/7/a/0/17a21c40ce4af3ac9514aac756403188.mp3*~data=user_id=0,application_id=42~hmac=76a48c73c23943b109e5c365526c300b27fdb062b236528c095f5fec066a57f8",
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
  if (!songData) return <Alert message="Loading..." />;

  // Handle No Results Found
  if (songData.length === 0) return <Alert message="No results Found" />;

  return (
    <>
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
    </>
  );
};

export default SongList;
