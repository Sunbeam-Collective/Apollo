import WaveSurfer from 'wavesurfer.js';
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js';

import {
  useContext,
  useEffect,
  useRef
} from 'react'

import {
  SongContext
} from '../context'

function MixerTimeline({ props }) {
  const {
    setCurrentTime, setDuration,
    playbackRate, setIsPlaying,
    audioURL
  } = props;

  // Shared states
  const { waveRef } = useContext(SongContext);

  // Grabbing the container element with React.
  const container = useRef(null);

  /**
  * This hooks initializes the waveform and the audio HTMLElement.
  * Courtesy of the wavesurfer.js library!
  *
  * It runs when the audioURL changes.
  * As of now, it happens only on mount.
  */
  useEffect(() => {
    if (waveRef.current) waveRef.current.destroy(); // Deallocate previous waveform, if applicable.
    // Initializing and configuring the waveform.
    waveRef.current = WaveSurfer.create({
      // Functionality
      url: audioURL,
      // Styling
      container: container.current,
      waveColor: '#343434',
      progressColor: '#FFE30E',
      cursorColor: '#FFFFFF',
      height: 200,
      width: '100vw',
      barWidth: 2,
      barGap: 3,
      normalize: true,
      hideScrollbar: false,
      dragToSeek: true,
      autoScroll: true,
      autoCenter: true,
    });
    // Wavesurfer.js plugin that enables zooming in/out on the audio waveform.
    waveRef.current.registerPlugin(
      ZoomPlugin.create({
        iterations: 3,
        scale: 0.25,
        maxZoom: 200,
      }),
    )

    /** EVENT HANDLERS
    * The following are handlers that are set up for the purpose
    * of bubbling up information for the parent component to use:
    */
    // The event 'ready' on a wavesurfer object is similar to the 'loadeddata' event on an audio HTMLElement.
    waveRef.current.on('ready', () => {
      setDuration(waveRef.current.getDuration());
    });
    // The event 'finish' on a wavesurfer object is similar to the 'ended' event on an audio HTMLElement.
    waveRef.current.on('finish', () => {
      waveRef.current.setTime(0);
      waveRef.current.pause();
      setCurrentTime(0);
      setIsPlaying(false);
    });
    // The event 'timeupdate' on a wavesurfer object is is similar to the '
    waveRef.current.on('timeupdate', (currentTime) => {
      // console.log('here: ', currentTime);
      setCurrentTime(currentTime / waveRef.current.getPlaybackRate());
    });

    // Cleanup for unmount or changes
    return () => {
      if (waveRef.current) {
        waveRef.current.destroy();
        waveRef.current = null;
      }
    }
  }, [audioURL]);

  /**
  * This hook handles dynamically updating the playback rate of the audio
  * rendered/played by the wavesurfer object.
  *
  * It runs whenever the playbackRate prop from the parent component changes.
  */
  useEffect(() => {
    // console.log('inside second')
    waveRef.current.setOptions({
      audioRate: playbackRate
    })
  }, [playbackRate]);

  return (
    <>
      <div className='mixer-timeline-container'>
        <div ref={container} className='wave-container' />
      </div>
    </>
  )
}

export default MixerTimeline;
