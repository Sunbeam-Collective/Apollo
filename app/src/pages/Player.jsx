import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import '../App.css';

import { getDeezerTrack } from "../services/deezerService";

import {
  TrackDetails,
  MediaControls,
  SecondaryNav,
} from '../components'

import {
  edit_icon
} from '../assets';

import {
  useScrollLock
} from '../adapters'

function Player() {
  useScrollLock();

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
        <TrackDetails
          title={track.title}
          artist={track.artist}
        />
        <div className='player-cover'>
          <img id='player-cover' src={track.coverSrc} alt={track.title} />
        </div>
        {/* timeline is scrubbable... hopefully */}
        <div className='player-timeline'>
          {/* ??? */}
        </div>
        <MediaControls />
        <div className='player-edit'>
          <div className='edit-button-div'>
            <img src={edit_icon} />
            <p>Edit</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Player;
