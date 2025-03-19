import { useParams, useNavigate  } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import '../App.css';

import { getDeezerTrack } from "../services/deezerService";

import {
  TrackDetails,
  MediaControls,
  SecondaryNav,
  Loading
} from '../components'

import { edit_icon } from "../assets";

import { useScrollLock } from "../adapters";

function Player() {
  // no scrolling while on player!
  useScrollLock();

  // fetching states
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [track, setTrack] = useState(null);

  useEffect(() => {
    // fetching
    const fetchTrack = async () => {
      const minDelay = new Promise(resolve => setTimeout(resolve, 500));
      let [track, error] = [null, null];
      const loadingTask = async () => {
        try {
          const { data } = await getDeezerTrack(id);
          track = {
            title: data.data.title,
            artist: data.data.artist.name,
            coverSrc: data.data.album.cover,
            previewSrc: data.data.preview,
          }
        } catch (err) {
          error = err
        }
      }
      await Promise.all([minDelay, loadingTask(id)]);
      if (track !== null) {
        // set audio here as well and handlers for music!!!
        // maybe we can disable the buttons if there's no audio initialized!
        setTrack(track);
      }
      else {
        console.error('Error fetching deezer charts:',error);
        setError(error);
      }
    }
    fetchTrack();
  }, [id]);

  if (error !== null) return <h1>{error.message}</h1>;
  if (track === null) return <Loading />;
  return (
    <>
      <div className="player-container">
        <SecondaryNav />
        <TrackDetails title={track.title} artist={track.artist} />
        <div className="player-cover">
          <img id="player-cover" src={track.coverSrc} alt={track.title} />
        </div>
        {/* timeline is scrubbable... hopefully */}
        <MediaControls
          previewSrc={track.previewSrc}
        />
        <div className='player-edit'>
          <button className='edit-button' onClick={() => navigate(`/mixer/${id}`)}>
            <img src={edit_icon} />
            <p>Edit</p>
          </button>
        </div>
      </div>
    </>
  );
}

export default Player;
