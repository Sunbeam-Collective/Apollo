import {
  useState,
  useEffect
} from 'react';

import {
  stop_icon_rect,
  play_icon_rect,
  pause_icon_rect,
} from '../assets';

function MixerControls({ props }) {
  const {
    currentTime,
    duration,
    isPlaying,
    togglePlay,
    handleStop
  } = props;

  // State used for visual feedback upon playbackRate prop change.
  const [textFeedback, setTextFeedback] = useState(false);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  /**
  * This hook handles some neat keyboard shortcuts
  * for Mixer controls' ease of access.
  *
  * It runs whenever the playing state changes.
  */
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'Escape':
          handleStop();
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, isPlaying]);

  /**
  * This hook handles dynamically updating the
  * currentTime and duration of the song being played.
  *
  * It runs whenever the duration prop changes. This accounts for when
  * the audio is progressing, or when the playbackRate prop changes (which, in turn)
  * also affects the currentTime prop.
  */
  useEffect(() => {
    setTextFeedback(true);
    const timer = setTimeout(() => {
      setTextFeedback(false);
    }, 500);
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
