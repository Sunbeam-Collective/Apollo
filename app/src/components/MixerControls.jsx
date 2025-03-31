import {
  stop_icon_rect,
  play_icon_rect,
  pause_icon_rect,
} from '../assets';

import {
  useState,
  useEffect
} from 'react';

function MixerControls({ props }) {
  const {
    currentTime,
    duration,
    isPlaying,
    togglePlay,
    handleStop
  } = props;

  const [textFeedback, setTextFeedback] = useState(false);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    /* KB SHORTCUT INITS */
    const handleKeyPress = (e) => {
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'Escape':
          handleStop();
          break;
        // case 'ArrowLeft':
        //   audioRef.current.currentTime -= 5;
        //   break;
        // case 'ArrowRight':
        //   audioRef.current.currentTime += 5;
        //   break;
        // case 'ArrowUp':
        //   const newVolume = Math.min(1, audioRef.current.volume + 0.1);
        //   audioRef.current.volume = newVolume;
        //   setVolume(newVolume);
        //   break;
        // case 'ArrowDown':
        //   const reducedVolume = Math.max(0, audioRef.current.volume - 0.1);
        //   audioRef.current.volume = reducedVolume;
        //   setVolume(reducedVolume);
        //   break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, isPlaying]);

  // visual feedback for currentTime/duration change
  useEffect(() => {
    setTextFeedback(true);
    const timer = setTimeout(() => {
      setTextFeedback(false);
    }, 500);
    // event cleanup
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className='mixer-controls-container'>
      <button id='stop-button-rect' onClick={handleStop}>
        <img id='stop-button-rect-icon' src={stop_icon_rect} />
      </button>
      <span
        style={{ color: textFeedback ? '#FFE30E' : 'white'}}
      >
        {formatTime(currentTime)}/{formatTime(duration)}
      </span>
      {
        isPlaying
        ? <button id='pause-button-rect' onClick={togglePlay}>
            <img id='pause-button-rect-icon' src={pause_icon_rect} />
          </button>
        : <button id='play-button-rect' onClick={togglePlay}>
            <img id='play-button-rect-icon' src={play_icon_rect} />
          </button>
      }
    </div>
  )
}

export default MixerControls;
