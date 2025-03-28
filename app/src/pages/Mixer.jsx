import {
  useState,
  useEffect,
  useContext,
  useRef
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

  // refs for audioCtx
  // const audioCtx = useRef(null);

  // audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isDragging, setIsDragging] = useState(false);


  // actual mp3 file states
  const audioBlob = useRef(null);
  const [audioURL, setAudioURL] = useState(null);

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
      console.log('blob: ', blob);
      console.log('blob raw data: ', blob.data);
      console.log('blob data size: ', blob.data.size);
      console.log('blob data type: ', blob.data.type);
      const audioURL = URL.createObjectURL(blob.data);
      console.log('converted to URL: ', audioURL);
      audioBlob.current = blob.data;
      setAudioURL(audioURL);
    }
    downloadFile();
    // cleanup
    return (() => {
      URL.revokeObjectURL(audioURL);
    })
  }, [track]);

  useEffect(() => {
    // grabbing the audio element itself
    console.log('testing inside mixer');
    console.log(trackRef.current);

    const audio = trackRef.current; // why do i have to do this?
    console.log('audio from trackRef.current: ', audio);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleStop); // same behavior anyway lol

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleStop); // same behavior anyway lol
    };
  }, [audioURL]);

  function handleTimeUpdate() {
    setCurrentTime(trackRef.current.currentTime);
  };

  function handleLoadedData() {
    setDuration(trackRef.current.duration);
    console.log('Audio duration: ', trackRef.current.duration);
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
    await trackRef.current.pause();
    setCurrentTime(0);
    setIsPlaying(false);
  }


  function handleSpeed(e) {
    trackRef.current.playbackRate = parseFloat(e.target.value);
    setPlaybackRate(e.target.value);
  }


  async function handleSave(e) {
    // standard song audio file parameters
    const numberOfChannels = 2; // stereo
    const sampleRate = 44100; // in Hz, cd quality apparently
    const length = sampleRate * duration;

    // init ctx...
    const audioCtx = new AudioContext();
    const offAudioCtx = new OfflineAudioContext(numberOfChannels, length, sampleRate);
    console.log('fresh audioCtx', audioCtx);

    // init source node for use with ctx
    // first convert the blob back into an ArrayBuffer...

    // creating an arrayBuffer of same length as buffer
    console.log('audioblob.current: ', audioBlob.current);
    const arrayBuffer = await audioBlob.current.arrayBuffer();

    // use that buffer ....
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);
    const source = new AudioBufferSourceNode(offAudioCtx, {
      buffer: decoded
    });
    // set playback rate, connect to dest, proceed
    source.playbackRate.value = playbackRate;
    source.connect(offAudioCtx.destination);
    source.start();
    const rendered = await offAudioCtx.startRendering();
    console.log('done rendering. output: ', rendered);

    // something goes wrong here
    // some refs
    // https://stackoverflow.com/questions/61264581/how-to-convert-audio-buffer-to-mp3-in-javascript

    const outputBlob = new Blob([rendered], { type: 'audio/mpeg' });
    console.log('converted to blob: ', outputBlob);
    const outputURL = URL.createObjectURL(outputBlob);
    console.log('converted to URL: ', outputURL);
    const link = document.createElement('a');
    link.href = outputURL;
    link.download = `${track.title}-mix.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(outputURL);


    // // commenting out for future ref
    // // init filters for ctx
    // const iirfilter = new IIRFilterNode(audioCtx, {
    //   feedforward: feedForward,
    //   feedback: feedBack
    // })
    // console.log('iirfilter created in audioctx', iirfilter);

    // connecting source -> { processing } -> destination



    // ??? more processing or something?
    // // redirect with iirfilter
    // source.connect(iirfilter).connect(audioCtx.destination);

    // console.log('source object: ', source);
    // console.log('audioCtx at this point ', audioCtx);

    // // something something autoplay
    // if (audioCtx.state === 'suspended') audioCtx.resume();
    // console.log('after connecting source to audioCtx', audioCtx);

    // // plain output
    // source.connect(audioCtx.destination);

  }

  return (
    <>
      <audio
        ref={trackRef}
        src={audioURL}
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
          props={{
            currentTime, duration,
            handleSpeed, playbackRate
          }}
        />
        <div className='save-container-mixer'>
          <button id='save-mixer-button' onClick={handleSave}>
            <img id='save-mixer-button-icon' src={save_icon_mixer} />
          </button>
        </div>
      </div>
    </>
  )
}

export default Mixer;
