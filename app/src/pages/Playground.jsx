import {
  // SoundTest,
  AuthTest,
  TrendingItem,
} from '../components';

import { useEffect, useState } from "react";

import {
  getDeezerTrack,
  getDeezerChart
} from "../services/deezerService";
import { useNavigate } from "react-router-dom";


function Playground() {
  const [error, setError] = useState(null);
  const [tracks, setTracks] = useState(null);
  const navigate = useNavigate();

  const handleTrendingClick = async (e) => {
    if (!e.target.closest('li')) return;
    const id = e.target.closest('li').dataset.id;
    navigate(`/player/${id}`);
  }


  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const { data } = await getDeezerChart();
        const tracks = data.data;
        setTracks(tracks);
      } catch (error) {
        console.error('Error fetching deezer charts:',error);
        setError(error);
      }
    }
    fetchTracks();
  }, []);

  if (error !== null) return <h1>{error.message}</h1>;
  if (tracks === null) return <h1>null tracks</h1>;

  const processed = tracks.map((track) => {
    return {
      id: track.id,
      songTitle: track.title,
      songArtist: track.artist.name,
      coverArt: track.album.cover,
      previewSrc: track.preview
    }
  })
  console.log(processed);
  return (
    <>
      {/* <SoundTest /> */}
      {/* <AuthTest /> */}
      {/* <h1>{test.title}</h1> */}
      <ul onClick={handleTrendingClick}>
        {
          tracks.map((item) => {
            return (
              <TrendingItem
                key={crypto.randomUUID()}
                position={item.position}
                id={item.id}
                title={item.title}
                artist={item.artist.name}
                coverSrc={item.album.cover}
              />
            )
          })
        }
      </ul>
    </>
  )
}

export default Playground;
