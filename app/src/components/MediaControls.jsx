
import {
  prev_icon,
  play_icon_round,
  pause_icon_round,
  next_icon,
  shuffle_icon,
  repeat_icon
} from '../assets';

import {
  useState,
  useRef,
  useEffect
} from 'react';

function MediaControls({ previewSrc }) {
  // audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  }

  const handleLoadedData = () => {
    setDuration(audioRef.current.duration);
  }

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  }

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }

  const handleVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  }

  useEffect(() => {

    const audio = audioRef.current; // why do i have to do this?
    console.log(audio);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);


  return (
    <>
      <audio
        ref={audioRef}
        src={previewSrc}
      />
      <div className='player-timeline'>
        {/* ??? */}
      </div>
      <div className='player-media-controls'>
        <button id='shuffle-button' onClick={() => {}}>
          <img src={shuffle_icon} />
        </button>
        <button id='prev-button' onClick={() => {}}>
          <img src={prev_icon} />
        </button>
        {
          isPlaying
          ?
          <button id='play-button-round' onClick={() => {}}>
            <img src={play_icon_round} />
          </button>
          :
          <button id='pause-button-round' onClick={() => {}}>
            <img src={pause_icon_round} />
          </button>
        }
        <button id='next-button' onClick={() => {}}>
          <img src={next_icon} />
        </button>
        <button id='repeat-button' onClick={() => {}}>
          <img src={repeat_icon} />
        </button>
      </div>
    </>
  )
}

export default MediaControls;
