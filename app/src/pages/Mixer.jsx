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


// standard song audio file parameters
const numberOfChannels = 2; // stereo
const sampleRate = 44100; // in Hz, cd quality apparently

function Mixer() {
  useScrollLock();

  // fetching states
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // context
  const { track, waveRef } = useContext(SongContext);

  // audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // dragging shenanigans
  const [isDragging, setIsDragging] = useState(false);
  const fromRate = useRef(1);

  // actual mp3 file states
  const baseBlob = useRef(null);
  const baseDuration = useRef(null);
  const [audioURL, setAudioURL] = useState(null);
  // const audioURL = useRef(null);
  const acRef = useRef(null);
  const liveSourceRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  // inits for IIR filter
  // don't mind this part, this is just for additional effects
  // that aren't playbackRate
  // they're actually straightforward to use in JS but i don't even
  // want to think about the UI/UX for this
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

  const initSourceNode = async (context, audioBlob) => {
    console.log('Creating AudioBufferSourceNode from an audio blob...');
    console.log('Converting audioBlob to audioBuffer...');
    console.log('audioBlob: ', audioBlob);
    const arrayBuffer = await audioBlob.arrayBuffer();
    console.log('---> arrayBuffer: ', arrayBuffer)
    const decoded = await context.decodeAudioData(arrayBuffer);
    console.log('---> audioBuffer: ', decoded);
    console.log('Initializing AudioBufferSourceNode with the decoded audioBuffer...')
    const source = new AudioBufferSourceNode(context, { buffer: decoded });
    console.log('---> AudioBufferSourceNode: ', source);
    console.log('!---initSourceNode() DONE---!');
    return source;
  }

  const processAudio = async (offAudioCtx) => {
    console.log('Rendering current offline audio context...');
    console.log('offAudioCtx: ', offAudioCtx);
    const rendered = await offAudioCtx.startRendering();
    console.log('---> rendered', rendered);
    console.log('Converting LR channel data from Float32Array to Int16Array (lamejs compatibility)...');
    const leftChannelData = rendered.getChannelData(0);
    const rightChannelData = rendered.getChannelData(1);
    console.log('leftChannelData: ', leftChannelData);
    console.log('rightChannelData: ', rightChannelData);
    const leftBuffer = new Int16Array(rendered.length);
    const rightBuffer = new Int16Array(rendered.length);
    for (let i = 0; i < rendered.length; i++) {
      // lamejs encodes values in the range [-32768, 32767]
      // but our buffers are floats in the range [-1, 1]
      // so we convert float to int16
      leftBuffer[i] = Math.max(-32768, Math.min(32767, Math.round(leftChannelData[i] * 32767)));
      rightBuffer[i] = Math.max(-32768, Math.min(32767, Math.round(rightChannelData[i] * 32767)));
    }
    console.log('---> left buffer: ', leftBuffer);
    console.log('---> right buffer: ', rightBuffer);
    console.log('Encoding left and right buffers to merged mp3Data blocks (using lamejs!)...');
    const mp3Encoder = new lamejs.Mp3Encoder(numberOfChannels, sampleRate, 128); // 128kbps is still up to standards and is the least amount of data so :sob:
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
    console.log(`Total samples processed: ${totalSamplesProcessed}, original buffer length: ${rendered.length}`);
    // adding the remainder
    const mp3Buff = mp3Encoder.flush();
    if (mp3Buff.length > 0) mp3Data.push(mp3Buff);
    console.log('---> mp3Data: ', mp3Data);
    console.log('---> mp3Data chunk length (first): ', mp3Data[0].length);
    console.log('---> mp3Data length ', mp3Data.length);
    console.log('Concatenating mp3Data blocks into singular UInt8Array for blobbing...');
    let totalLength = 0;
    for (const chunk of mp3Data) totalLength += chunk.length;
    const mp3DataFull = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of mp3Data) {
      mp3DataFull.set(chunk, offset);
      offset += chunk.length;
    }
    console.log('---> unified UInt8Array: ', mp3DataFull);
    console.log('---> unified UInt8Array length: ', mp3DataFull.length);
    return mp3DataFull;
  }


  useEffect(() => {
    const downloadFile = async () => {
      const blob = await getTrackFile(track.previewSrc);
      console.log('blob: ', blob);
      console.log('blob raw data: ', blob.data);
      console.log('blob data size: ', blob.data.size);
      console.log('blob data type: ', blob.data.type);
      baseBlob.current = blob.data;
      console.log('current blob: ', baseBlob.current);

      // // init acRef if applicable
      // if (acRef.current === null) acRef.current = new AudioContext();

      // // rename for ease
      // const audioCtx = acRef.current;

      // // init the source node
      // const source = await initSourceNode(audioCtx, baseBlob.current)
      // liveSourceRef.current = source;

      // // connect the nodes, no effects
      // source.connect(audioCtx.destination);

      // generate a url from a blob
      const audioURL = URL.createObjectURL(baseBlob.current);

      // state change for rerenders
      setAudioURL(audioURL);
    }
    downloadFile();
  }, []);

  // setting up listeners everytime... react rerenders... crazy
  // useEffect(() => {
  //   const audio = trackRef.current;
  //   audio.addEventListener('timeupdate', handleTimeUpdate);
  //   audio.addEventListener('loadeddata', handleLoadedData);
  //   audio.addEventListener('ended', handleStop); // same behavior anyway lol
  //   return () => {
  //     audio.removeEventListener('timeupdate', handleTimeUpdate);
  //     audio.removeEventListener('loadeddata', handleLoadedData);
  //     audio.removeEventListener('ended', handleStop); // same behavior anyway lol
  //   };
  // }, [playbackRate]);

  // function handleTimeUpdate() {
  //   setCurrentTime(trackRef.current.currentTime / playbackRate);
  // };

  // function handleLoadedData() {
  //   // so we know the original duration of the base audio
  //   if (isFirstLoad) {
  //     baseDuration.current = trackRef.current.duration;
  //     setIsFirstLoad(false);
  //   }
  //   trackRef.current.preservesPitch = false;
  //   setDuration(trackRef.current.duration);
  //   console.log('Audio duration: ', trackRef.current.duration);
  // }

  const togglePlay = () => {
    try {
      // if (isPlaying) {
      //   await trackRef.current.pause();
      // } else {
      //   await trackRef.current.play();
      // }
      waveRef.current.playPause();
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play state: ', error);
    }
  }

  // async function handleStop() {
  //   trackRef.current.currentTime = 0;
  //   await trackRef.current.pause();
  //   setCurrentTime(0);
  //   setIsPlaying(false);
  // }

  const handleStop = () => {
    waveRef.current.stop();
    setCurrentTime(0);
    setIsPlaying(false);
  }

  // function handleSpeed(e) {
  //   const rate = parseFloat(e.target.value);
  //   trackRef.current.playbackRate = rate;

  //   // rerender
  //   setPlaybackRate(rate);
  //   setDuration(baseDuration.current / rate); // LMAO
  // }

  const handleSpeed = (listItem) => {
    const rate = parseFloat(listItem.textContent) / 100;
    waveRef.current.setPlaybackRate(rate, false);
    console.log(rate);

    // rerender
    setPlaybackRate(rate);
    setDuration(baseDuration.current / rate); // LMAO
  }

  // // archiving these (and the end function) for now
  // function handleSpeedDrag(e) {
  //   if (isPlaying) togglePlay();
  //   setIsDragging(true);
  //   setPlaybackRate(e.target.value);
  // }
  // async function handleSpeedDragEnd(e) {
  //   // make a new offline audio context
  //   const length = sampleRate * (baseDuration.current / playbackRate);
  //   const offACtx = new OfflineAudioContext(numberOfChannels, length, sampleRate);

  //   // recreate source
  //   const blob = baseBlob.current;
  //   console.log('current blob: ', baseBlob.current);
  //   const source = await initSourceNode(offACtx, blob);

  //   // apply effects/changes
  //   source.playbackRate.value = playbackRate;
  //   const adjustedDuration = baseDuration.current / playbackRate;

  //   // connect new source to context
  //   source.connect(offACtx.destination);
  //   source.start();

  //   // make new audio url
  //   const mp3DataFull = await processAudio(offACtx);
  //   // close context (stops source too)
  //   // offACtx.close();
  //   const outputBlob = new Blob([mp3DataFull], { type: 'audio/mpeg' });
  //   // free current url, then create new one
  //   console.log(audioURL);
  //   URL.revokeObjectURL(audioURL);
  //   const newAudioURL = URL.createObjectURL(outputBlob);

  //   // state updates for rerender
  //   setIsDragging(false);
  //   setAudioURL(newAudioURL);
  //   setDuration(adjustedDuration);
  //   setCurrentTime(0);
  // }

  const handleSave = async () => {
    // pause the track and put loading modal up front
    waveRef.current.pause();
    setIsSaving(true);


    // adjusting the length based on playbackrate
    console.log('baseDuration before saving: ', baseDuration.current);
    console.log('playbackRate before saving: ', playbackRate);
    const length = sampleRate * (baseDuration.current / playbackRate);

    // init ctx...
    const offACtx = new OfflineAudioContext(numberOfChannels, length, sampleRate);
    console.log('fresh offAudioCtx', offACtx);

    // init the source node
    const blob = baseBlob.current;
    console.log('current blob: ', baseBlob.current);
    const source = await initSourceNode(offACtx, blob);

    // set playback rate
    source.playbackRate.value = playbackRate;

    // apply effects. gain is just to make sure that volume is preserved. (might not be necessary)
    const gainNode = offACtx.createGain();
    gainNode.gain.value = 1.0;

    // connect the nodes with effects and render
    source.connect(gainNode);
    gainNode.connect(offACtx.destination);
    source.start();

    // process the audio for blobbing
    // audioContext -> Float32Array -> Int16Array -> [] UInt8Array -> UInt8Array
    const mp3DataFull = await processAudio(offACtx);
    // close context (stops source too)
    // offACtx.close();

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
    setIsSaving(false);
  }

  return (
    <>
      {isSaving && (
        <Loading
          style={{
            position: 'absolute',
            zIndex: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
        />
      )}
      {/* <audio
        ref={trackRef}
        src={audioURL}
        playsInline
      /> */}
      <div className='mixer-container'>
        <SecondaryNav />
        <TrackDetails
          title={track.title}
          artist={track.artist}
        />
        <MixerTimeline
          props={{
            setCurrentTime, setDuration,
            playbackRate, setIsPlaying,
            audioURL, baseDuration
          }}
        />
        <MixerControls
          props={{
            isPlaying,
            duration,
            currentTime,
            togglePlay,
            handleStop
          }}
        />
        <ControlKnobs
          props={{
            playbackRate,
            handleSpeed
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
