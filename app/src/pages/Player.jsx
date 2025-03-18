import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { getDeezerTrack } from "../services/deezerService";

function Player() {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [track, setTrack] = useState(null);

  useEffect(() => {
    const fetchTrack = async (id) => {
      try {
        const { data } = await getDeezerTrack(id);
        const track = {
          title: data.data.title,
          artist: data.data.artist.name,
          coverSrc: data.data.album.cover,
          previewSrc: data.data.preview,
        }
        setTrack(track);
      } catch (error) {
        console.error('Error fetching deezer charts:',error);
        setError(error);
      }
    }
    fetchTrack(id);
  }, []);

  if (error !== null) return <h1>{error.message}</h1>;
  if (track === null) return <h1>loading buhhh</h1>;
  return (
    <>
      <div className='player-container'>
        <div className='player-details'>
          <p>{track.title}</p>
          <p>{track.artist}</p>
        </div>
        <div className='player-cover'>
          <img src={track.coverSrc} alt={track.title} />
        </div>
        <div className='player-timeline'>
          {/* ??? */}
        </div>
        <div className='player-media-controls'>
          {/* five icons here probably just as svg so we can export the figma vectors directly and call it a day
          <svg />
          <svg />
          <svg />
          <svg />
          <svg /> */}
        </div>
        <div className='player-edit'>
          <div className='edit-button-div'>
            {/* same approach as media controls
            <svg /> */}
            <p>Edit</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Player;
