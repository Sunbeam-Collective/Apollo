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
  useNavigate,
  useLocation
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
  getDeezerTrack,
  getTrackFile
} from '../services/deezerService'

import * as fs from 'fs';
import * as http from 'http';

function Mixer() {
  useScrollLock();

  // fetching states
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // context
  const { track, trackRef } = useContext(SongContext);

  // audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // actual mp3 file
  const [audioFile, setAudioFile] = useState(null);

  // inits for IIR filter
  const lowPassCoefs = [
    {
      frequency: 200,
      feedforward: [0.00020298, 0.0004059599, 0.00020298],
      feedback: [1.0126964558, -1.9991880801, 0.9873035442],
    },
    {
      frequency: 500,
      feedforward: [0.0012681742, 0.0025363483, 0.0012681742],
      feedback: [1.0317185917, -1.9949273033, 0.9682814083],
    },
    {
      frequency: 1000,
      feedforward: [0.0050662636, 0.0101325272, 0.0050662636],
      feedback: [1.0632762845, -1.9797349456, 0.9367237155],
    },
    {
      frequency: 5000,
      feedforward: [0.1215955842, 0.2431911684, 0.1215955842],
      feedback: [1.2912769759, -1.5136176632, 0.7087230241],
    },
  ];
  const filterNumber = 2;
  const feedForward = lowPassCoefs[filterNumber].feedforward;
  const feedBack = lowPassCoefs[filterNumber].feedback;


  useEffect(() => {
    async function downloadFile() {
      const blob = await getTrackFile(track.previewSrc);
      console.log('blob raw data: ', blob.data);
      const audioURL = URL.createObjectURL(blob.data);
      console.log('converted to URL: ', audioURL);
      setAudioFile(audioURL);
    }
    downloadFile();
  }, []);

  useEffect(() => {
    console.log('testing inside mixer');
    console.log(trackRef.current);

    // init ctx
    const audioCtx = new AudioContext();
    console.log('fresh audioCtx', audioCtx);

    // init source node for use with ctx
    const source = audioCtx.createMediaElementSource(audioFile);
    console.log('source created with audioctx', source);

    // init filters for ctx
    const iirfilter = new IIRFilterNode(audioCtx, {
      feedforward: feedForward,
      feedback: feedBack
    })
    console.log('iirfilter created in audioctx', iirfilter);

    // connecting source -> { processing } -> destination
    source.connect(audioCtx.destination);
    // source.connect(iirfilter).connect(audioCtx.destination);

    // something something autoplay
    if (audioCtx.state === 'suspended') audioCtx.resume();


    console.log('after connecting source to audioCtx', audioCtx);
    const audio = trackRef.current; // why do i have to do this?
    console.log('audio from trackRef.current: ', audio);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioFile]);

  function handleTimeUpdate() {
    setCurrentTime(trackRef.current.currentTime);
  };

  function handleLoadedData() {
    setDuration(trackRef.current.duration);
    console.log('Audio duration: ', trackRef.current.duration);
  }

  async function handleEnded() {
    setCurrentTime(0);
    await trackRef.current.pause();
  }

  async function togglePlay() {
    try {
      if (isPlaying) {
        await trackRef.current.pause();
      } else {
        await trackRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play state: ', error);
    }
  }

  async function handleStop() {
    trackRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
    await trackRef.current.pause();
  }

  return (
    <>
      <audio
        ref={trackRef}
        src={audioFile}
        playsInline
      />
      <div className='mixer-container'>
        <SecondaryNav />
        <TrackDetails
          title={track.title}
          artist={track.artist}
        />
        <MixerTimeline
          props={{
            currentTime,
            duration
          }}
        />
        <MixerControls
          props={{
            isPlaying, setIsPlaying,
            duration, setDuration,
            currentTime, setCurrentTime,
            togglePlay, handleStop
          }}
        />
        <ControlKnobs
        />
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
