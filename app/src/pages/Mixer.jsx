import lamejs from "lamejs";

import {
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';

import {
  useParams,
  useNavigate,
  useLocation
} from 'react-router-dom';

import {
  SongContext
} from '../context'

import {
  MixerHelp,
  MixerControls,
  TrackDetails,
  MixerTimeline,
  ControlKnobs,
  SecondaryNav,
  Loading
} from '../components'

import {
  getTrackFile
} from '../utils/deezerService'

import {
  save_icon_load,
  save_icon_mixer
} from '../assets'


// Standard song audio file parameters
const numberOfChannels = 2; // Indicates stereo
const sampleRate = 44100; // Hz, cd quality apparently

function Mixer() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Help 'modal' states
  const [helpActive, setHelpActive] = useState(false);

  // Shared states
  const { track, waveRef } = useContext(SongContext);

  // Audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Dragging shenanigans
  // const [isDragging, setIsDragging] = useState(false);
  // const fromRate = useRef(1);

  // Actual mp3 file states
  const baseBlob = useRef(null);
  const baseDuration = useRef(null);
  const [audioURL, setAudioURL] = useState(null);
  // const audioURL = useRef(null);
  // const acRef = useRef(null);
  // const liveSourceRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  /**
  * Inits for IIR filter
  *
  * Don't mind this part, this is just for additional effects that aren't playbackRate.
  * They're actually straightforward to use in JS but I don't even want to think about the UI/UX for this.
  * MAYBE: a future feature? TBD.
  */
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

  /**
  * Initializes an AudioBufferSourceNode from an audio blob.
  *
  * @param {AudioContext} context - The audio context.
  * @param {Blob} audioBlob - The audio blob to decode.
  * @returns {Promise<AudioBufferSourceNode>} - A promise that resolves to the initialized AudioBufferSourceNode.
  */
  const initSourceNode = async (context, audioBlob) => {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const decoded = await context.decodeAudioData(arrayBuffer);
    const source = new AudioBufferSourceNode(context, { buffer: decoded });
    return source;
  }

  /**
   * Processes audio data from an offline audio context, encodes it to MP3 format, and returns the MP3 data as a Uint8Array.
   *
   * @param {OfflineAudioContext} offAudioCtx - The offline audio context containing the audio data to process.
   * @returns {Promise<Uint8Array>} - A promise that resolves to the MP3 data as a Uint8Array.
   */
  const processAudio = async (offAudioCtx) => {
    const rendered = await offAudioCtx.startRendering();
    const leftChannelData = rendered.getChannelData(0);
    const rightChannelData = rendered.getChannelData(1);
    const leftBuffer = new Int16Array(rendered.length);
    const rightBuffer = new Int16Array(rendered.length);
    for (let i = 0; i < rendered.length; i++) {
      /**
      * lamejs encodes values in the range [-32768, 32767],
      * but our buffers are floats in the range [-1, 1].
      * So we convert our floats to fit those int16 bounds.
      */
      leftBuffer[i] = Math.max(-32768, Math.min(32767, Math.round(leftChannelData[i] * 32767)));
      rightBuffer[i] = Math.max(-32768, Math.min(32767, Math.round(rightChannelData[i] * 32767)));
    }
    const mp3Encoder = new lamejs.Mp3Encoder(numberOfChannels, sampleRate, 128); // 128kbps is still up to standards and is the least amount of data so :sob:
    const mp3Data = [];
    const sampleBlockSize = 1152;
    let totalSamplesProcessed = 0;
    for (let i = 0; i < rendered.length; i += sampleBlockSize) {
      const leftChunk = leftBuffer.subarray(i, i + sampleBlockSize);
      const rightChunk = rightBuffer.subarray(i, i + sampleBlockSize);
      totalSamplesProcessed += leftChunk.length;
      const mp3Buff = mp3Encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3Buff.length > 0) mp3Data.push(mp3Buff);
    }
    // Adding the remainder
    const mp3Buff = mp3Encoder.flush();
    if (mp3Buff.length > 0) mp3Data.push(mp3Buff);
    /**
    * Merging []Uint8Array into Uint8Array
    *
    * 1. Compute the total length needed by checking each chunk (each Uint8Array size)
    * 2. Create a Uint8Array with that total length
    * 3. Fill it in with the data per chunk.
    */
    let totalLength = 0;
    for (const chunk of mp3Data) totalLength += chunk.length;
    const mp3DataFull = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of mp3Data) {
      mp3DataFull.set(chunk, offset);
      offset += chunk.length;
    }
    return mp3DataFull;
  }

  /**
  * Toggles the play/pause state of the waveform and updates the isPlaying state.
  *
  * @param {void}
  * @returns {void}
  * @sideEffects:
  *  - Calls `waveRef.current.playPause()` to toggle playback.
  *  - Updates the `isPlaying` state using `setIsPlaying(!isPlaying)`.
  *  - Logs an error to the console if an error occurs during playback.
  */
  const togglePlay = () => {
    try {
      waveRef.current.playPause();
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play state: ', error);
    }
  }

  /**
   * Stops the audio playback, resets the current time to 0, and updates the isPlaying state.
   *
   * @param {void}
   * @returns {void}
   * @sideEffects:
   *  - Stops the audio playback using waveRef.current.stop().
   *  - Sets the current time to 0 using setCurrentTime(0).
   *  - Sets the isPlaying state to false using setIsPlaying(false).
   */
  const handleStop = () => {
    waveRef.current.stop();
    setCurrentTime(0);
    setIsPlaying(false);
  }

  /**
   * Sets the playback rate of the audio and updates the state to reflect the new rate, adjusting current time and duration accordingly.
   *
   * @param {number} rate The desired playback rate.
   * @returns {void}
   * @sideEffects:
   *  - Sets the playback rate of the audio using waveRef.current.setPlaybackRate(rate, false).
   *  - Sets the playbackRate state to the new rate using setPlaybackRate(rate).
   *  - Updates the currentTime state based on the new rate.
   *  - Updates the duration state based on the new rate.
   */
  const handleSpeed = (rate) => {
    waveRef.current.setPlaybackRate(rate, false);
    setPlaybackRate(rate);
    setCurrentTime(waveRef.current.getCurrentTime() / rate); // LMAO
    setDuration(waveRef.current.getDuration() / rate); // LMAO
  }

  /**
   * Pauses the audio, initiates the saving process, and triggers a download of the processed audio as an MP3 file.
   *
   * @param {void}
   * @returns {void}
   * @sideEffects:
   *  - Pauses audio playback and displays saving modal.
   *  - Creates and processes audio using OfflineAudioContext with effects and current playback rate.
   *  - Generates and triggers the download of the processed audio as an MP3 file.
   *  - Cleans up resources and hides the saving modal.
   */
  const handleSave = async () => {
    // Pause track and saving screen trigger
    waveRef.current.pause();
    setIsPlaying(false);
    setIsSaving(true);
    /**
    * The alotted length of the array buffer depends on
    * the playbackRate and the duration of the audio file.
    */
    const length = sampleRate * (waveRef.current.getDuration() / playbackRate);
    // Create offline context, initialize source node with the current audio blob.
    const offACtx = new OfflineAudioContext(numberOfChannels, length, sampleRate);
    const blob = baseBlob.current;
    const source = await initSourceNode(offACtx, blob);
    // TODO: Adjust playbackRate and apply effects. Gain is just to make sure that volume is preserved and may not be necessary.
    source.playbackRate.value = playbackRate;
    const gainNode = offACtx.createGain();
    gainNode.gain.value = 1.0;
    // Connect the nodes in order onto the destination.
    source.connect(gainNode);
    gainNode.connect(offACtx.destination);
    source.start();
    // Render the offline context and process it into a Uint8Array.
    const mp3DataFull = await processAudio(offACtx);
    /**
    * To simulate a 'download', the processed audio is blobbed
    * and generated its own URL to attach to a link which
    * simulates a user interaction. The URL is freed after,
    * then the saving screen is hidden.
    */
    const outputBlob = new Blob([mp3DataFull], { type: 'audio/mpeg' });
    const outputURL = URL.createObjectURL(outputBlob);
    const link = document.createElement('a');
    link.href = outputURL;
    const timestamp = new Date().getTime();
    link.download = `${timestamp}-mix.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(outputURL);
    setIsSaving(false);
  }

  // TODO: IMPORTANT BEFORE DEPLOYING
  const handleToggleHelp = () => {
    setHelpActive(!helpActive);
  }

  /**
  * This hook handles the initialization of the audioURL
  * that is passed onto the MixerTimeline component which
  * creates the audio HTMLElement along with the waveRef
  * waveform (courtesy of wavesurfer.js)!
  *
  * It runs only on Mixer mount.
  */
  useEffect(() => {
  /**
  * To handle refreshes...
  * TODO: Implement proper state management with tools like
  *  Redux to gracefully handle refreshes on pages/components
  *  that have props/contexts that are dependent on parents.
  */
  if (track === null) {
    navigate(
      `/home`,
      { state: { from: `/mixer/${id}` } }
    )
    return;
  }
    const downloadFile = async () => {
      /**
      * minDelay here is to make sure that the Loading component shows
      * for at least 500 seconds. API calls with getDeezerTrack() is
      * variable, but usually takes very fast (sub 500ms)!
      * This is more of a UX choice so that the transition is
      * smooth and easily interpreted by the user.
      */
      const minDelay = new Promise((resolve) => setTimeout(resolve, 500));
      let audioURL;
      const processBlob = async () => {
        const blob = await getTrackFile(track.previewSrc);
        baseBlob.current = blob.data;
        audioURL = URL.createObjectURL(baseBlob.current);
      }
      /**
      * Promise.all executes the provided async functions concurrently!
      * putting minDelay with loadingTask(id) makes sure that it waits
      * at least 500ms (since that was our minDelay) until it moves
      * onto the next task.
      */
      await Promise.all([minDelay, processBlob()]);
      setAudioURL(audioURL);
      setIsLoading(false);
    };
    downloadFile();
  }, []);

  /**
  * To handle refreshes...
  * TODO: Implement proper state management with tools like
  *  Redux to gracefully handle refreshes on pages/components
  *  that have props/contexts that are dependent on parents.
  */
  if (track === null) {
    navigate(
      `/home`,
      { state: { from: `/mixer/${id}` } }
    )
    return;
  }

  if (isLoading) return <Loading />;
  return (
    <>
      {helpActive &&
        <MixerHelp handleToggleHelp={handleToggleHelp} />
      }
      {isSaving &&
        <>
          <Loading
            style={{
              position: 'absolute',
              zIndex: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }}
          >
          </Loading>
          <img
            id='save-icon-load'
            src={save_icon_load}
            style={{
              position: 'absolute',
              zIndex: 30,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </>
      }
      <div className='mixer-container'>
        <SecondaryNav
          props={{
            handleToggleHelp
          }}
        />
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
