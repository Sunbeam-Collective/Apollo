import {
  useState,
  useEffect,
  useContext
} from 'react';

import {
  useParams,
  useNavigate
} from 'react-router-dom';

import {
  MixerControls,
  TrackDetails,
  MixerTimeline,
  ControlKnobs,
  SecondaryNav,
  Loading
} from '../components'

import {
  save_icon_mixer
} from '../assets'

import {
  useScrollLock
} from '../adapters'

import {
  getDeezerTrack
} from '../services/deezerService'

function Mixer() {
  useScrollLock();

  const [isPlaying, setIsPlaying] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [track, setTrack] = useState(null);

  // placeholders
  const duration = '00:00/00:30';

  useEffect(() => {
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
      if (track !== null) setTrack(track);
      else {
        console.error('Error fetching deezer charts:',error);
        setError(error);
      }
    }
    fetchTrack();
  }, []);

  if (error !== null) return <h1>{error.message}</h1>;
  if (track === null) return <Loading />;
  return (
    <>
      <div className='mixer-container'>
        <SecondaryNav />
        <TrackDetails
          title={track.title}
          artist={track.artist}
        />
        <MixerTimeline />
        <div className='duration-container'>
          <p className='duration-text'>{duration}</p>
        </div>
        <MixerControls
          isPlaying={isPlaying}
        />
        <ControlKnobs />
        <div className='save-container-mixer'>
          <button id='save-mixer-button' onClick={() => {}}>
            <img id='save-mixer-button-icon' src={save_icon_mixer} />
          </button>
        </div>
      </div>
    </>
  )
}

export default Mixer;
