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

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// quick and dirty ref - https://wavesurfer.xyz/examples/?soundcloud.js
// Define the waveform gradient
const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 3.5)
gradient.addColorStop(0, '#656666') // Top color
gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
gradient.addColorStop(1, '#B1B1B1') // Bottom color

// Define the progress gradient
const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 3.5)
progressGradient.addColorStop(0, '#FFE30E') // Top color
progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#FFE30E') // Top color
progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#FEF9D0') // Bottom color
progressGradient.addColorStop(1, '#FEF9D0') // Bottom color

function MixerTimeline({ props }) {
  const {
    setCurrentTime, setDuration,
    playbackRate, setIsPlaying,
    audioURL
  } = props;

  const { waveRef } = useContext(SongContext);

  const container = useRef(null);

  useEffect(() => {
    // console.log('inside first')
    if (waveRef.current) waveRef.current.destroy(); // deallocate previous wave
    waveRef.current = WaveSurfer.create({
      // functionality
      url: audioURL,
      // styling
      container: container.current,
      waveColor: gradient,
      progressColor: progressGradient,
      // waveColor: '#343434',
      // progressColor: '#FFE30E',
      cursorColor: '#FFFFFF',
      height: 200,
      width: '100vw',
      barWidth: 2,
      barGap: 3,
      normalize: true,
      // barRadius: 5,
      hideScrollbar: false,
      dragToSeek: true,
      autoScroll: true,
      autoCenter: true,
      // minPxPerSec: 100,
    });
    // events
    waveRef.current.on('ready', () => {
      // console.log('wave is now ready!');
      // so we know how to scale the current time and duration
      // when playback rate changes
      setDuration(waveRef.current.getDuration());
    });
    waveRef.current.on('finish', () => {
      waveRef.current.setTime(0);
      waveRef.current.pause();
      setCurrentTime(0);
      setIsPlaying(false);
    });
    waveRef.current.on('timeupdate', (currentTime) => {
      // console.log('here: ', currentTime);
      setCurrentTime(currentTime / waveRef.current.getPlaybackRate());
    });
    // zoom plugin
    waveRef.current.registerPlugin(
      ZoomPlugin.create({
        iterations: 3,
        scale: 0.25,
        maxZoom: 200,
      }),
    )

    // cleanup for unmount or changes
    return () => {
      if (waveRef.current) {
        waveRef.current.destroy(); // wavesurfer deallocation
        waveRef.current = null;
      }
    }
  }, [audioURL]);

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
