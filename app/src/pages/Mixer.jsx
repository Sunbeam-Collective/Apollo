import lamejs from "lamejs";

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
    const sampleRate = 48000; // in Hz, cd quality apparently
    const length = sampleRate * duration;

    // init ctx...
    const audioCtx = new AudioContext();
    const offAudioCtx = new OfflineAudioContext(numberOfChannels, length, sampleRate);
    console.log('fresh audioCtx', audioCtx);

    // convert audioBlob -> arrayBuffer
    console.log('audioblob.current: ', audioBlob.current);
    const arrayBuffer = await audioBlob.current.arrayBuffer();
    console.log('audioBlob -> arrayBuffer output: ', arrayBuffer);

    // convert arrayBuffer -> audioBuffer
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);
    console.log('arrayBuffer -> audioBuffer output: ', decoded);

    // assign that value to the source buffer node
    const source = offAudioCtx.createBufferSource();
    source.buffer = decoded;

    // set playback rate
    source.playbackRate.value = playbackRate;

    // apply effects. gain is just to make sure that volume is preserved. (might not be necessary)
    const gainNode = offAudioCtx.createGain();
    gainNode.gain.value = 1.0;

    // connect the nodes
    source.connect(gainNode);
    gainNode.connect(offAudioCtx.destination);
    source.start();
    const rendered = await offAudioCtx.startRendering();
    console.log('done rendering. output: ', rendered);

    // now we have to separate into two channels for stereo output
    const leftChannelData = rendered.getChannelData(0);
    const rightChannelData = rendered.getChannelData(1);

    // convert buffers from Float32Array to Int16Array
    const leftBuffer = new Int16Array(rendered.length);
    const rightBuffer = new Int16Array(rendered.length);
    for (let i = 0; i < rendered.length; i++) {
      // lamejs encodes values in the range [-32768, 32767]
      // but our buffers are floats in the range [-1, 1]
      // so we convert float to int16
      leftBuffer[i] = Math.max(-32768, Math.min(32767, Math.round(leftChannelData[i] * 32767)));
      rightBuffer[i] = Math.max(-32768, Math.min(32767, Math.round(rightChannelData[i] * 32767)));
    }
    console.log('left buffer: ', leftBuffer);
    console.log('right buffer: ', rightBuffer);

    // encoding left and right buffers to merged mp3Data blocks
    const mp3Encoder = new lamejs.Mp3Encoder(numberOfChannels, sampleRate, 128); // 128kps...
    const mp3Data = [];
    const sampleBlockSize = 1152;

    let totalSamplesProcessed = 0;
    for (let i = 0; i < rendered.length; i += sampleBlockSize) {
      const leftChunk = leftBuffer.subarray(i, i + sampleBlockSize);
      const rightChunk = rightBuffer.subarray(i, i + sampleBlockSize);
      console.log(`Processing chunk from ${i} to ${i + leftChunk.length}, chunk size: ${leftChunk.length}`);
      totalSamplesProcessed += leftChunk.length;
      const mp3Buff = mp3Encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3Buff.length > 0) mp3Data.push(mp3Buff);
    }
    // checking length...
    console.log(`Total samples processed: ${totalSamplesProcessed}, original buffer length: ${rendered.length}`);

    // adding the remainder block
    const mp3Buff = mp3Encoder.flush(); // remainder...
    if (mp3Buff.length > 0) mp3Data.push(mp3Buff);

    // verification logs ...
    console.log('resulting mp3data: ', mp3Data);
    console.log('typeof mp3data: ', typeof mp3Data);
    console.log("mp3Data.length:", mp3Data.length);
    if (mp3Data.length > 0) {
      console.log("First mp3Data chunk length:", mp3Data[0].length);
    }

    // concat uin8arrays into a single uint8array for blobbing
    let totalLength = 0;
    for (const chunk of mp3Data) {
      totalLength += chunk.length;
    }
    const mp3DataFull = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of mp3Data) {
      mp3DataFull.set(chunk, offset);
      offset += chunk.length;
    }
    // check if the length stays the same
    console.log("mp3DataFull.length:", mp3DataFull.length);

    // making the blob now
    const outputBlob = new Blob([mp3DataFull], { type: 'audio/mpeg' });
    console.log('converted to blob: ', outputBlob);

    // creating a URL for the blob
    const outputURL = URL.createObjectURL(outputBlob);
    console.log('converted to URL: ', outputURL);

    // blob -> link element
    const link = document.createElement('a');
    link.href = outputURL;
    const timestamp = new Date().getTime();
    link.download = `${timestamp}-mix.mp3`;

    // simulating a click to the link element to download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // cleanup
    URL.revokeObjectURL(outputURL);
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
