import {
  useState,
  useEffect,
  useContext
} from 'react';

import {
  SongContext
} from '../context'

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


  const { track } = useContext(SongContext);

  // placeholders
  const duration = '00:00/00:30';


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
